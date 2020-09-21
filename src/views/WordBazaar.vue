<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <h1>Word Bazaar Prototype</h1>
    <!-- eslint-disable vue/html-self-closing -->
    <input v-model="newWord" />
    <button @click="createWordSale">
      <!-- eslint-disable vue-i18n/no-raw-text -->
      Create Word
    </button>
    <hr />
    <a
      v-for="[word, sale] in wordRegistryState && wordRegistryState.tokens"
      :key="word"
      @click="selectWord(word, sale)"
    >
      {{ word }}
    </a>
    <div v-if="selectedWord">
      <h2>{{ selectedWord }}</h2>
      <div>
        <!-- eslint-disable vue/html-self-closing -->
        <input
          v-model="buyAmount"
          type="number"
        />
        <button @click="buy">
          <!-- eslint-disable vue-i18n/no-raw-text -->
          Buy
        </button> (1 {{ selectedWord }} per AE bought)
      </div>
      <div>
        <!-- eslint-disable vue/html-self-closing -->
        <input
          v-model="sellAmount"
          type="number"
        />
        <button @click="sell">
          <!-- eslint-disable vue-i18n/no-raw-text -->
          Sell
        </button> (0.5 AE per {{ selectedWord }} returned)
      </div>
      <div>
        <h2>Votes ({{ spread }} AE spread)</h2>
        (start voting to payout to inserted address)
        <input
          v-model="newVotePayout"
          placeholder="ak_..."
        />
        <button @click="createVote">
          <!-- eslint-disable vue-i18n/no-raw-text -->
          Create Vote
        </button>
        <div
          v-for="vote in votes && votes"
          :key="vote.id"
        >
          to: {{ vote.subject.VotePayout[0].slice(0, 12) }}... {{ vote.votePercent }}% positive
          <button
            v-if="!vote.isClosed"
            @click="voteOption(vote.instance, true)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->For
          </button>
          <button
            v-if="!vote.isClosed"
            @click="voteOption(vote.instance, false)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->Against
          </button>
          <span v-if="vote.isClosed">(vote closed)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import TOKEN_VOTING_CONTRACT from 'wordbazaar-contracts/TokenVoting.aes';
import { client, createOrChangeAllowance } from '@/utils/aeternity';
import backend from '@/utils/backend';
import util from '@/utils/util';
import { EventBus } from '@/utils/eventBus';
import { mapState } from 'vuex';

export default {
  name: 'WordBazaar',
  data: () => ({
    newWord: '',
    words: [],
    wordRegistryState: null,
    selectedWord: null,
    selectedWordContract: null,
    buyAmount: 0,
    sellAmount: 0,
    spread: 0,
    votes: null,
    newVotePayout: '',
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    setTimeout(this.updateWords, 5000);
  },
  methods: {
    async updateWords() {
      this.wordRegistry = await client
        .getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: 'ct_jM5Rpj2AzwJKoDHrjMnGNqAjm9gW77qV52soooAGzi7fMmubY' });
      this.wordRegistryState = (await this.wordRegistry.methods.get_state()).decodedResult;
      this.selectWord(this.wordRegistryState.tokens[0][0], this.wordRegistryState.tokens[0][1]);
    },
    async createWordSale() {
      const tokenSale = await client.getContractInstance(TOKEN_SALE_CONTRACT);
      await tokenSale.methods.init();
      const token = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      await token.methods.init(`${this.newWord} Token`, 18, this.newWord,
        tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      await backend.addToken(token.deployInfo.address);
      await tokenSale.methods.set_token(token.deployInfo.address);
      await this.wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await this.updateWords();
    },
    async selectWord(word, sale) {
      this.selectedWordContract = await client
        .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress: sale });
      this.spread = util.shiftDecimalPlaces(
        (await this.selectedWordContract.methods.spread()).decodedResult, -18,
      ).toFixed();
      this.votes = await Promise.all((await this.selectedWordContract.methods.votes()).decodedResult
        .map(([id, vote]) => this.getVoteInfo(id, vote)));
      this.selectedWord = word;
    },
    async getVoteInfo(id, vote) {
      const tokenVoting = await client.getContractInstance(TOKEN_VOTING_CONTRACT,
        { contractAddress: vote });
      const state = (await tokenVoting.methods.get_state()).decodedResult;
      console.log('getVoteInfo', state);

      const votedFor = state.vote_state.find(([s]) => s)[1];
      const votedAgainst = state.vote_state.find(([s]) => !s)[1];
      const ifAgainstZero = votedFor === 0 ? 0 : 100;

      return {
        id,
        instance: tokenVoting,
        subject: state.metadata.subject,
        closeHeight: state.close_height,
        isClosed: (await client.height()) >= state.close_height,
        votePercent: votedAgainst !== 0 ? votedFor / votedAgainst : ifAgainstZero,
      };
    },
    async voteOption(instance, option) {
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      const tokenContract = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT,
        { contractAddress: token });

      const amount = (await tokenContract.methods.balance(this.address)).decodedResult;
      await createOrChangeAllowance(token, amount,
        instance.deployInfo.address.replace('ct_', 'ak_'));

      await instance.methods.vote(option, amount);
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
    },
    async createVote() {
      const tokenVoting = await client.getContractInstance(TOKEN_VOTING_CONTRACT);

      const metadata = {
        subject: { VotePayout: [this.newVotePayout] },
        description: `Payout spread of ${this.selectedWord} to ${this.newVotePayout}`,
        link: 'https://aeternity.com/',
      };
      const closeHeight = (await client.height()) + 20;
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      await tokenVoting.methods.init(metadata, closeHeight, token);

      await await this.selectedWordContract.methods.add_vote(tokenVoting.deployInfo.address);
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
    },
    async buy() {
      await this.selectedWordContract.methods
        .buy({ amount: util.shiftDecimalPlaces(this.buyAmount, 18).toFixed() });
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      await backend.invalidateTokenCache(token);
      EventBus.$emit('reloadData');
    },
    async sell() {
      const amount = util.shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      await createOrChangeAllowance(token, amount,
        this.selectedWordContract.deployInfo.address.replace('ct_', 'ak_'));
      await this.selectedWordContract.methods.sell(amount);
      EventBus.$emit('reloadData');
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  margin-right: 0.5rem;
  text-decoration: underline !important;
}

h2 {
  margin-top: 1rem;
}
</style>
