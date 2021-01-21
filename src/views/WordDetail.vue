<template>
  <div>
    <BackButtonRibbon>
      <template v-slot:title>
        <span class="abbreviation">{{ selectedWord }}</span>
      </template>
    </BackButtonRibbon>

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabs"
    >
      <WordBuySellButtons
        v-if="saleContractAddress && activity === 'info'"
        :sale="saleContractAddress"
      />
    </ActivityRibbon>

    <div v-if="activity === 'info'">
      <div class="asset_details__section">
        <div
          v-if="data"
          class="asset_details__info"
        >
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Ticker') }}</h3>
            <div>{{ selectedWord }}</div>
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.CurrentPrice') }}</h3>
            <div>
              <AeAmount
                :amount="data.buyPrice"
                aettos
              />
            </div>
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.SellPrice') }}</h3>
            <AeAmount
              :amount="data.sellPrice"
              aettos
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
              no-symbol
            />
          </div>
        </div>

        <div class="asset_details__section-content">
          <h3>{{ $t('components.WordDetail.Asset') }}</h3>
          <div
            v-if="data && tokenInfo"
            class="asset-details__asset"
          >
            {{ tokenInfo[data.tokenAddress].name }}
          </div>
          <h3>{{ $t('components.WordDetail.Description') }}</h3>
          <div
            v-if="data"
            class="asset-details__description"
          >
            {{ data.description }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedWord && activity === 'voting'">
      <div class="asset_voting__section">
        <TabBar
          v-model="activeTab"
          :tabs="tabs"
        >
          <IconPlus
            v-if="activeTab === 'ongoing' && maxAmount > 0"
            class="plus"
            :class="{ rotate: showInitiate }"
            @click="showInitiate = !showInitiate"
          />
        </TabBar>

        <Transition name="fade">
          <div
            v-if="activeTab === 'ongoing' && data && showInitiate"

            class="initiate-vote"
          >
            <Loader
              v-if="loading"
              :progress-message="progressMessage"
              :message="$t('views.WordDetail.ConfirmMessage')"
            />
            <template v-else>
              <i18n
                path="components.WordDetail.Release"
                tag="div"
                class="stake-label"
              >
                <AeAmount
                  :amount="data.spread"
                  aettos
                />
              </i18n>

              <div class="initiate-vote-inputs">
                <input
                  v-model.trim="newVotePayout"
                  :disabled="loading.createVote"
                  class="form-control"
                  placeholder="Enter aeternity address"
                >

                <AeButton
                  :disabled="!newVotePayout"
                  :loading="loading.createVote"
                  @click="createVote"
                >
                  <IconCheckmarkCircle />
                  {{ $t('components.WordDetail.Initiate') }}
                </AeButton>
              </div>
            </template>
          </div>
        </Transition>
        <div
          v-if="data"
          class="asset_details__info"
        >
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Spread') }}</h3>
            <AeAmount
              :amount="data.spread"
              aettos
            />
            <FiatValue
              :amount="data.spread"
              aettos
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('components.WordDetail.Stake') }}</h3>
            <div>
              <AeAmount
                :token="data.tokenAddress"
                :amount="data.totalSupply / 2"
              />
            </div>
          </div>
        </div>

        <div class="asset_details__section">
          <div class="asset_details__section-content">
            <div
              v-if="!votes.length && activeTab === 'ongoing' && !loading"
              class="no-content"
            >
              <h3>{{ $t('views.WordDetail.NoVotes') }}</h3>
              <i18n
                v-if="maxAmount > 0"
                path="views.WordDetail.VoteText"
                tag="p"
              >
                <template v-slot:balance>
                  <AeAmount
                    :token="data.tokenAddress"
                    :amount="maxAmount"
                  />
                </template>
                <template v-slot:spread>
                  <AeAmount
                    :amount="data.spread"
                    aettos
                  />
                </template>
              </i18n>
              <AeButton
                v-if="maxAmount > 0"
                @click="showInitiate = !showInitiate"
              >
                <IconCheckmarkCircle />
                {{ $t('components.WordDetail.Initiate') }}
              </AeButton>
            </div>
            <VoteCard
              v-for="vote in votes"
              :key="vote.id"
              :vote="vote"
              :data="data"
              :contract-address="saleContractAddress"
              :info="tokenInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';
import IconCheckmarkCircle from '../assets/iconCheckmarkCircle.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import AeAmount from '../components/AeAmount.vue';
import FiatValue from '../components/FiatValue.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import AeButton from '../components/AeButton.vue';
import Loader from '../components/Loader.vue';
import VoteCard from '../components/VoteCard.vue';
import { shiftDecimalPlaces, blockToDate } from '../utils';

export default {
  name: 'WordBazaar',
  components: {
    TabBar,
    ActivityRibbon,
    AeAmount,
    FiatValue,
    WordBuySellButtons,
    BackButtonRibbon,
    AeButton,
    IconCheckmarkCircle,
    IconPlus,
    Loader,
    VoteCard,
  },
  data: () => ({
    wordRegistryState: null,
    selectedWord: null,
    saleContractAddress: null,
    ongoingVotes: [],
    pastVotes: [],
    myVotes: [],
    data: null,
    newVotePayout: '',
    tokenVoting: {},
    activity: 'info',
    activeTab: 'ongoing',
    ribbonTabs: [{ icon: IconInfo, text: 'Token Info', activity: 'info' }, { icon: IconPie, text: 'Voting', activity: 'voting' }],
    tabs: [{ text: 'Ongoing Votes', tab: 'ongoing' }, { text: 'Past Votes', tab: 'past' }, { text: 'My Votes', tab: 'my' }],
    loading: false,
    progressMessage: '',
    showInitiate: false,
  }),
  computed: {
    ...mapState(['address', 'tokenInfo', 'tokenBalances']),
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
    maxAmount() {
      const tokenBalance = this.tokenBalances && this.data
        && this.tokenBalances.find((b) => b.token === this.data.tokenAddress);

      return tokenBalance ? tokenBalance.balance : '0';
    },
  },
  watch: {
    maxAmount() {
      this.loadVotes();
    },
  },
  async created() {
    this.selectedWord = this.$route.params.word;
    this.loading = true;
    await this.reloadData();
    this.loading = false;
    EventBus.$on('reloadData', async (callback) => {
      await this.reloadData();
      callback();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async reloadData() {
      this.wordRegistryState = await Backend.getWordRegistry();

      // eslint-disable-next-line prefer-destructuring
      this.saleContractAddress = this.wordRegistryState
        .find((word) => word.word === this.selectedWord).sale;

      await this.loadSpread();
      await this.loadVotes();
    },
    async loadSpread() {
      this.data = await Backend.getWordSale(this.saleContractAddress);
    },
    calculateVoteStatus(vote, height) {
      const voterAccount = vote.voteAccounts.find(([acc]) => acc === this.address);

      const accountHasVoted = !!voterAccount;
      const hasWithdrawAmount = voterAccount
        && new BigNumber(voterAccount[1][0]).isGreaterThan(0) && !voterAccount[1][2];

      const showRevoke = !vote.isClosed && accountHasVoted;
      const showVoteOption = !vote.isClosed && !accountHasVoted;
      const showApplyPayout = vote.isClosed && !vote.alreadyApplied
        && !vote.timeouted && vote.isSuccess;
      const showWithdraw = vote.isClosed && hasWithdrawAmount;

      const statusClosed = vote.isClosed && !vote.alreadyApplied && !vote.timeouted;
      const statusClosedAndUnsuccessful = statusClosed && !vote.isSuccess;
      const statusApplied = vote.alreadyApplied;
      const statusTimeouted = !vote.alreadyApplied && vote.timeouted;
      const statusTimeouting = statusClosed && !statusClosedAndUnsuccessful && !statusTimeouted;
      const statusOngoing = (!vote.isClosed || !(statusTimeouted || statusApplied))
        && !statusClosedAndUnsuccessful;
      const statusPast = statusTimeouted || statusApplied || statusClosedAndUnsuccessful;

      const statusMy = accountHasVoted;
      const stakeMaxAmount = showVoteOption ? this.maxAmount : 0;
      const stakeAmountUnshifted = voterAccount ? voterAccount[1][0] : stakeMaxAmount;
      const stakeAmount = shiftDecimalPlaces(
        stakeAmountUnshifted, -this.tokenInfo[this.data.tokenAddress].decimals,
      ).toFixed(2);

      const dateClose = blockToDate(vote.closeHeight, height);
      const dateTimeout = blockToDate(vote.timeoutHeight, height);

      return {
        ...vote,
        accountHasVoted,
        hasWithdrawAmount,
        showRevoke,
        showVoteOption,
        showApplyPayout,
        showWithdraw,
        statusClosed,
        statusClosedAndUnsuccessful,
        statusApplied,
        statusTimeouted,
        statusTimeouting,
        statusOngoing,
        statusPast,
        statusMy,
        stakeAmount,
        initialStakeAmount: stakeAmount,
        dateClose,
        dateTimeout,
      };
    },
    async loadVotes() {
      let votes = await Backend.getWordSaleVotesDetails(this.saleContractAddress);
      const height = await this.$store.dispatch('aeternity/getHeight');
      votes = votes.map((vote) => this.calculateVoteStatus(vote, height));

      this.ongoingVotes = votes.filter((v) => v.statusOngoing);
      this.pastVotes = votes.filter((v) => v.statusPast);
      this.myVotes = votes.filter((v) => v.statusMy);
    },
    async createVote() {
      this.loading = true;
      this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[0]');
      try {
        const metadata = {
          subject: { VotePayout: [this.newVotePayout] },
          description: `Payout spread of ${this.selectedWord} to ${this.newVotePayout}`,
          link: 'https://aeternity.com/',
        };

        const height = await this.$store.dispatch('aeternity/getHeight');
        const closeHeight = height + 20;
        const token = await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'get_token',
          });
        const address = await this.$store.dispatch('aeternity/deployTokenVotingContract', {
          metadata,
          closeHeight,
          token,
        });

        this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[1]');

        await this.initSaleContract();
        await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'add_vote',
            args: [address],
          });
        await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote was not created!',
          primaryButtonText: 'OK',
        });
      } finally {
        this.loading = false;
        this.progressMessage = '';
        EventBus.$emit('reloadData');
      }
    },
  },
  metaInfo() {
    return { title: this.$t('components.WordDetail.Title', { word: this.selectedWord }) };
  },
};
</script>

<style lang="scss" scoped>
h3 {
  color: $small_heading_color;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2rem;
}

.asset_details__section {
  background-color: $light_color;
  font-weight: 500;
  font-size: 0.75rem;

  .asset-details__asset {
    color: $pure_white;
    padding-bottom: 1rem;
  }

  .asset-details__description {
    color: $tip_note_color;
    padding-bottom: 1rem;
  }

  .asset_details__info {
    background-color: $thumbnail_background_color;
  }

  .asset_details__section-content {
    padding: 1.5rem;

    .no-content {
      display: flex;
      flex-direction: column;

      h3 {
        color: $pure_white;
      }

      button {
        width: 154px;
        margin: 0 auto;
      }
    }
  }
}

.asset_details__info {
  padding: 1.5rem;
  display: flex;
  flex-direction: row;

  .info-item {
    flex-shrink: 1;
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    background: $super_dark;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    margin-right: 16px;
    padding: 16px;

    &:hover {
      background: #141414;

      h3 {
        color: #babac0;
      }
    }

    @include mobile {
      font-size: 0.6rem;

      h3 {
        font-size: 0.8rem;
        line-height: 1rem;
      }
    }
  }
}

.asset_voting__section {
  .asset_details__info {
    background-color: $light_color;
  }
}

.initiate-vote {
  margin-bottom: 0.1rem;
  padding: 1.2rem;

  &.fade-enter-active,
  &.fade-leave-active {
    transition: all 0.5s ease;
  }

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
    transform: height(0);
  }

  .initiate-vote-inputs {
    display: flex;
    flex-direction: row;
    margin-top: 0.4rem;

    input {
      background-color: $buttons_background;
      color: $standard_font_color;
      border: 0.05rem solid $buttons_background;
      border-radius: 0.25rem;
      flex: 1;
      margin-right: 1.2rem;
      font-size: 0.7rem;
      height: 2rem;

      &:focus,
      &:active {
        border: 0.05rem solid $secondary_color;
        box-shadow: none;
      }
    }

    .ae-button {
      font-size: 0.8rem;
      height: 2rem;
    }
  }

  .loading {
    text-align: center;

    img {
      height: 56px;
    }
  }
}

::v-deep .stake-label {
  color: $small_heading_color;
  font-weight: 500;
  font-size: 0.75rem;
  padding-left: 0.1rem;
}

.abbreviation {
  font-weight: 500;
  color: #1161fe;
}

.plus {
  transition: transform 0.5s;

  &.rotate {
    transform: rotate(45deg);
  }
}
</style>
