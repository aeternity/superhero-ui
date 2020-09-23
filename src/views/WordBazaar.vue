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
          to: {{ vote.subject.VotePayout[0].slice(0, 9) }}... {{ vote.votePercent }}% positive
          <button
            v-if="!vote.isClosed && !vote.accountHasVoted"
            @click="voteOption(vote.instance, true)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->For
          </button>
          <button
            v-if="!vote.isClosed && !vote.accountHasVoted"
            @click="voteOption(vote.instance, false)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->Against
          </button>
          <button
            v-if="!vote.isClosed && vote.accountHasVoted"
            @click="revokeVote(vote.instance)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->Revoke
          </button>
          <span v-if="vote.isClosed && !vote.alreadyApplied">(vote closed)</span>
          <span v-if="vote.alreadyApplied">(result applied)</span>
          <span v-if="!vote.alreadyApplied && vote.timeouted">(timeouted)</span>
          <button
            v-if="vote.isClosed && !vote.alreadyApplied && !vote.timeouted && hasSpread"
            @click="applyPayout(vote.id)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->Apply Payout
          </button>
          <button
            v-if="vote.isClosed && vote.hasWithdrawAmount"
            @click="withdraw(vote.instance)"
          >
            <!-- eslint-disable vue-i18n/no-raw-text -->Withdraw
          </button>
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
import BigNumber from "bignumber.js";

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
          { contractAddress: 'ct_2t35yjUT4Bh3sLkTqaXNnZeH1gqnn55JB8UX2dM5XLi6ea6UyE' });
      this.wordRegistryState = (await this.wordRegistry.methods.get_state()).decodedResult;
      this.selectWord(this.wordRegistryState.tokens[0][0], this.wordRegistryState.tokens[0][1]);
    },
    async createWordSale() {
      const tokenSale = await client.getContractInstance(TOKEN_SALE_CONTRACT);
      await tokenSale.methods.init(20);
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
        .map(([id, vote]) => this.getVoteInfo(id, vote[1], vote[0])));
      this.selectedWord = word;
    },
    async getVoteInfo(id, vote, alreadyApplied) {
      const tokenVoting = await client.getContractInstance(TOKEN_VOTING_CONTRACT,
        { contractAddress: vote });
      const state = (await tokenVoting.methods.get_state()).decodedResult;
      const voteTimeout = (await this.selectedWordContract.methods.vote_timeout()).decodedResult;
      const height = await client.height();

      const votedFor = state.vote_state.find(([s]) => s)[1];
      const votedAgainst = state.vote_state.find(([s]) => !s)[1];
      const ifAgainstZero = votedFor === 0 ? 0 : 100;
      const votedPositive = new BigNumber(votedFor)
        .dividedBy(new BigNumber(votedFor).plus(votedAgainst)).times(100).toFixed(0);
      const voterAccount = state.vote_accounts.find(([acc]) => acc === this.address);

      return {
        id,
        alreadyApplied,
        instance: tokenVoting,
        subject: state.metadata.subject,
        timeouted: (state.close_height + voteTimeout) < height,
        closeHeight: state.close_height,
        accountHasVoted: !!voterAccount,
        hasSpread: new BigNumber(this.spread).isGreaterThan(0),
        hasWithdrawAmount: voterAccount
          && new BigNumber(voterAccount[1][0]).isGreaterThan(0) && !voterAccount[1][2],
        isClosed: height >= state.close_height,
        votePercent: votedAgainst !== 0 ? votedPositive : ifAgainstZero,
      };
    },
    async applyPayout(id) {
      await this.selectedWordContract.methods.apply_vote_subject(id);
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
      EventBus.$emit('reloadData');
    },
    async withdraw(instance) {
      await instance.methods.withdraw();
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
      EventBus.$emit('reloadData');
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
      EventBus.$emit('reloadData');
    },
    async revokeVote(instance) {
      await instance.methods.revoke_vote();
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
      EventBus.$emit('reloadData');
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

      await this.selectedWordContract.methods.add_vote(tokenVoting.deployInfo.address);
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
      await this.selectWord(this.selectedWord, this.selectedWordContract.deployInfo.address);
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
