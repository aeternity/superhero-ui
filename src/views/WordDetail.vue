<template>
  <div>
    <BackButtonRibbon :title="selectedWord">
      <WordBuySellButtons :sale="saleContractAddress" />
    </BackButtonRibbon>

    <div class="asset_details__section" v-if="selectedWord">
      <!-- eslint-disable vue-i18n/no-raw-text -->
      <span>Votes ({{ spread }} AE spread)</span>
      (start voting to payout to inserted address)
      <input
        v-model="newVotePayout"
        placeholder="ak_..."
      >
      <button @click="createVote">
        <!-- eslint-disable vue-i18n/no-raw-text -->
        Create Vote
      </button>
      <div
        v-for="vote in votes && votes"
        id="vote"
        :key="vote.id"
      >
        to: {{ vote.subject.VotePayout[0].slice(0, 9) }}...
        {{ vote.votePercent }}% positive {{ vote.stakePercent }}% stake positive
        <br>
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
        <span v-if="vote.isClosed && !vote.alreadyApplied">vote closed</span>
        <span v-if="vote.alreadyApplied">, result applied</span>
        <span v-if="!vote.alreadyApplied && vote.timeouted">, timeouted</span>
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
</template>

<script>
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import TOKEN_VOTING_CONTRACT from 'wordbazaar-contracts/TokenVoting.aes';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { client, createOrChangeAllowance } from '../utils/aeternity';
import { shiftDecimalPlaces } from '../utils';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';

export default {
  name: 'WordBazaar',
  components: {
    WordBuySellButtons,
    BackButtonRibbon,
  },
  data: () => ({
    wordRegistryState: null,
    selectedWord: null,
    selectedWordContract: null,
    saleContractAddress: null,
    spread: 0,
    votes: null,
    newVotePayout: '',
    tokenVoting: {},
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    this.selectedWord = this.$route.params.word;
    this.updateWords();
  },
  methods: {
    async updateWords() {
      this.wordRegistryState = await Backend.getWordRegistry();
      // eslint-disable-next-line no-unused-vars
      const [_, saleContractAddress] = this.wordRegistryState.tokens
        .find(([word]) => word === this.selectedWord);

      this.saleContractAddress = saleContractAddress;

      this.loadSpread();
      this.loadVotes();
    },
    async loadSpread() {
      const data = await Backend.getWordSale(this.saleContractAddress);
      this.spread = shiftDecimalPlaces(data.spread, -18).toFixed();
    },
    async loadVotes() {
      this.selectedWordContract = this.selectedWordContract ? this.selectedWordContract
        : await client
          .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress: this.saleContractAddress });

      this.votes = await Promise.all((await this.selectedWordContract.methods.votes()).decodedResult
        .map(([id, vote]) => this.getVoteInfo(id, vote[1], vote[0])));
    },
    async getVoteInfo(id, vote, alreadyApplied) {
      this.tokenVoting[vote] = this.tokenVoting[vote] ? this.tokenVoting[vote]
        : await client.getContractInstance(TOKEN_VOTING_CONTRACT, { contractAddress: vote });
      const state = (await this.tokenVoting[vote].methods.get_state()).decodedResult;
      const voteTimeout = (await this.selectedWordContract.methods.vote_timeout()).decodedResult;
      const height = await client.height();

      const votedFor = state.vote_state.find(([s]) => s)[1];
      const votedAgainst = state.vote_state.find(([s]) => !s)[1];
      const ifAgainstZero = votedFor === 0 ? 0 : 100;
      const votedPositive = new BigNumber(votedFor)
        .dividedBy(new BigNumber(votedFor).plus(votedAgainst)).times(100).toFixed(0);
      const voterAccount = state.vote_accounts.find(([acc]) => acc === this.address);
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      const tokenContract = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT,
        { contractAddress: token });
      const totalSupply = (await tokenContract.methods.total_supply()).decodedResult;

      return {
        id,
        alreadyApplied,
        instance: this.tokenVoting[vote],
        subject: state.metadata.subject,
        timeouted: (state.close_height + voteTimeout) < height,
        closeHeight: state.close_height,
        accountHasVoted: !!voterAccount,
        hasSpread: new BigNumber(this.spread).isGreaterThan(0),
        hasWithdrawAmount: voterAccount
          && new BigNumber(voterAccount[1][0]).isGreaterThan(0) && !voterAccount[1][2],
        isClosed: height >= state.close_height,
        votePercent: votedAgainst !== 0 ? votedPositive : ifAgainstZero,
        stakePercent: new BigNumber(votedFor).dividedBy(totalSupply).times(100).toFixed(0),
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
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 1rem;
}

#vote {
  margin-bottom: 0.5rem;
}

.asset_details__section {
  background-color: $light_color;
}

</style>
