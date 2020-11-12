<template>
  <!-- eslint-disable vue-i18n/no-raw-text -->
  <div>
    <BackButtonRibbon :title="selectedWord">
      <WordBuySellButtons
        v-if="saleContractAddress"
        :sale="saleContractAddress"
      />
    </BackButtonRibbon>

    <ActivityRibbon
      :tabs="ribbonTabs"
      :activity="activity"
      :set="(setActivity) => activity = setActivity"
    />

    <div v-if="activity === 'info'">
      <div class="asset_details__section">
        <div class="asset_details__section-content">
          <h3>Asset</h3>
          <div class="asset-details__asset">{{ selectedWord }}</div>
          <h3>Description</h3>
          <div class="asset-details__description">
            The Matrix is everywhere. It is all around us. Even now, in this very room.
            You can see it when you look out your window or when you turn on your television.
            You can feel it when you go to work... when you go to church...
            when you pay your taxes. It is the world that has been pulled over your eyes to blind
            you from the truth. What truth?
            That you are a slave, Neo. Like everyone else you were born into bondage.
            Into a prison that you cannot taste or
            see or touch. A prison for your mind.
          </div>
        </div>

        <div class="asset_details__info" v-if="data">
          <div class="info-item">
            <h3>Ticker</h3>
            <div>{{ selectedWord }}</div>
          </div>
          <div class="info-item">
            <h3>Current Price</h3>
            <div>
              <AeAmount
                :amount="data.buyPrice"
              />
            </div>
          </div>
          <div class="info-item">
            <h3>Initial Price</h3>
            <AeAmount
              :amount="data.buyPrice"
            />
          </div>
          <div class="info-item">
            <h3>Circulating Supply</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedWord && activity === 'voting'">
      <div class="asset_voting__section">

        <TabBar
          :tabs="tabs"
          :active-tab="activeTab"
          :set="(setTab) => activeTab = setTab"
        />

        <div class="asset_details__info" v-if="data">
          <div class="info-item">
            <h3>Accumulated Spread</h3>
            <AeAmount :amount="spread"/>
          </div>
          <div class="info-item">
            <h3>Circulating Supply</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
          <div class="info-item">
            <h3>Majority Stake</h3>
            <div>
              >
              <AeAmount
                :token="data.tokenAddress"
                :amount="data.totalSupply / 2"
              />
            </div>
          </div>
        </div>

        <div class="asset_details__section">
          <div class="asset_details__section-content">
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
              v-for="vote in votes"
              id="vote"
              :key="vote.id"
            >
              to: {{ vote.subject.VotePayout[0].slice(0, 9) }}...
              {{ vote.votePercent }}% positive {{ vote.stakePercent }}% stake positive
              <br>
              <button
                v-if="!vote.isClosed && !vote.accountHasVoted"
                @click="voteOption(vote.voteAddress, true)"
              >
                <!-- eslint-disable vue-i18n/no-raw-text -->For
              </button>
              <button
                v-if="!vote.isClosed && !vote.accountHasVoted"
                @click="voteOption(vote.voteAddress, false)"
              >
                <!-- eslint-disable vue-i18n/no-raw-text -->Against
              </button>
              <button
                v-if="!vote.isClosed && vote.accountHasVoted"
                @click="revokeVote(vote.voteAddress)"
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
                @click="withdraw(vote.voteAddress)"
              >
                <!-- eslint-disable vue-i18n/no-raw-text -->Withdraw
              </button>
            </div>
          </div>
        </div>
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
import { getClient, createOrChangeAllowance } from '../utils/aeternity';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';
import AeAmount from '../components/AeAmount.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';

export default {
  name: 'WordBazaar',
  components: {
    TabBar,
    ActivityRibbon,
    AeAmount,
    WordBuySellButtons,
    BackButtonRibbon,
  },
  data: () => ({
    wordRegistryState: null,
    selectedWord: null,
    selectedWordContract: null,
    saleContractAddress: null,
    spread: 0,
    ongoingVotes: [],
    pastVotes: [],
    myVotes: [],
    data: null,
    newVotePayout: '',
    tokenVoting: {},
    activity: 'voting',
    activeTab: 'ongoing',
    ribbonTabs: [{ icon: IconInfo, text: 'Token Info', activity: 'info' }, { icon: IconPie, text: 'Voting', activity: 'voting' }],
    tabs: [{ text: 'Ongoing Votes', tab: 'ongoing' }, { text: 'Past Votes', tab: 'past' }, { text: 'My Votes', tab: 'my' }],
  }),
  computed: {
    ...mapState(['address']),
    votes() {
      switch (this.activeTab) {
        case 'ongoing':
          return this.ongoingVotes;
        case 'past':
          return this.pastVotes;
        case 'my':
          return this.myVotes;
        default:
          return [];
      }
    },
  },
  mounted() {
    this.selectedWord = this.$route.params.word;
    this.updateWords();
  },
  methods: {
    async updateWords() {
      this.wordRegistryState = await Backend.getWordRegistry();

      // eslint-disable-next-line prefer-destructuring
      this.saleContractAddress = this.wordRegistryState.tokens
        .find(([word]) => word === this.selectedWord)[1];

      this.loadSpread();
      this.loadVotes();
    },
    async loadSpread() {
      this.data = await Backend.getWordSale(this.saleContractAddress);
    },
    async loadVotes() {
      let votes = await Backend.getWordSaleVotesDetails(this.saleContractAddress);
      votes = votes.map((vote) => {
        const voterAccount = vote.voteAccounts.find(([acc]) => acc === this.address);

        vote.accountHasVoted = !!voterAccount;
        vote.hasWithdrawAmount = voterAccount
          && new BigNumber(voterAccount[1][0]).isGreaterThan(0) && !voterAccount[1][2];

        return vote;
      });

      this.ongoingVotes = votes.filter((v) => !v.isClosed);
      this.pastVotes = votes.filter((v) => v.isClosed);
      this.myVotes = [];
    },
    async applyPayout(id) {
      await this.initSaleContractIfUnknown();
      await this.selectedWordContract.methods.apply_vote_subject(id);
      EventBus.$emit('reloadData');
    },
    async withdraw(address) {
      await this.initTokenVotingContractIfUnknown(address);
      await this.tokenVoting[address].methods.withdraw();
      await Backend.invalidateWordSaleVoteStateCache(address);
      this.updateWords();
      EventBus.$emit('reloadData');
    },
    async voteOption(address, option) {
      await this.initSaleContractIfUnknown();
      await this.initTokenVotingContractIfUnknown(address);

      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      const tokenContract = await getClient().then((client) => client
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: token }));

      const amount = (await tokenContract.methods.balance(this.address)).decodedResult;
      await createOrChangeAllowance(token, amount, address.replace('ct_', 'ak_'));

      await this.tokenVoting[address].methods.vote(option, amount);
      await Backend.invalidateWordSaleVoteStateCache(address);
      this.updateWords();
      EventBus.$emit('reloadData');
    },
    async revokeVote(address) {
      await this.initTokenVotingContractIfUnknown(address);
      await this.tokenVoting[address].methods.revoke_vote();
      await Backend.invalidateWordSaleVoteStateCache(address);
      this.updateWords();
      EventBus.$emit('reloadData');
    },
    async createVote() {
      await this.initSaleContractIfUnknown();

      const tokenVoting = await getClient()
        .then((client) => client.getContractInstance(TOKEN_VOTING_CONTRACT));

      const metadata = {
        subject: { VotePayout: [this.newVotePayout] },
        description: `Payout spread of ${this.selectedWord} to ${this.newVotePayout}`,
        link: 'https://aeternity.com/',
      };
      const closeHeight = (await getClient().then((client) => client.height())) + 20;
      await tokenVoting.methods.init(metadata, closeHeight, this.data.tokenAddress);

      await this.selectedWordContract.methods.add_vote(tokenVoting.deployInfo.address);
      await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
      EventBus.$emit('reloadData');
    },
    async initTokenVotingContractIfUnknown(vote) {
      this.tokenVoting[vote] = this.tokenVoting[vote] ? this.tokenVoting[vote]
        : await getClient().then((client) => client
          .getContractInstance(TOKEN_VOTING_CONTRACT, { contractAddress: vote }));
    },
    async initSaleContractIfUnknown() {
      if (!this.selectedWordContract) {
        this.selectedWordContract = await getClient().then((client) => client
          .getContractInstance(TOKEN_SALE_CONTRACT,
            { contractAddress: this.saleContractAddress }));
      }
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

h3 {
  color: $small_heading_color;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2rem;
}

.asset_details__section {
  background-color: $light_color;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.5rem;

  .asset-details__asset {
    color: $pure_white;
    padding-bottom: 1rem;
  }

  .asset-details__description {
    color: $lighter_grey_color;
    padding-bottom: 1rem;
  }

  .asset_details__info {
    background-color: $thumbnail_background_color;
  }

  .asset_details__section-content {
    padding: 1.6rem;
  }
}

.asset_details__info {
  padding: 1.6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .info-item {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
  }
}

.asset_voting__section {
  .asset_details__info {
    background-color: $light_color;
  }
}

</style>
