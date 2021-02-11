<template>
  <div class="word-detail">
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
            <h3>{{ $t('views.WordDetail.Abbreviation') }}</h3>
            <div>{{ selectedWord }}</div>
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.CurrentPrice') }}</h3>
            <div>
              <AeAmount
                :amount="data.buyPrice"
                aettos
              />
            </div>
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.SellPrice') }}</h3>
            <AeAmount
              :amount="data.sellPrice"
              aettos
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
              no-symbol
            />
          </div>
        </div>

        <div class="asset_details__section-content">
          <h3>{{ $t('views.WordDetail.Asset') }}</h3>
          <div
            v-if="data && tokenInfo"
            class="asset-details__asset"
          >
            {{ tokenInfo[data.tokenAddress] && tokenInfo[data.tokenAddress].name }}
          </div>
          <h3>{{ $t('views.WordDetail.Description') }}</h3>
          <div
            v-if="data"
            class="asset-details__description"
          >
            {{ data.description }}
          </div>
          <h3>{{ $t('views.WordDetail.BondingCurve') }}</h3>
          <div
            v-if="data"
            class="asset-details__chart"
          >
            <figure>
              <BondingCurve
                :data="chartData"
              />
              <figcaption class="legend">
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendBuyPrice') }}</h3>
                  <div>
                    <AeAmount
                      :amount="chartData.bondingBuyPrice.toNumber()"
                      aettos
                    />
                    <FiatValue
                      :amount="chartData.bondingBuyPrice.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendSellPrice') }}</h3>
                  <div>
                    <AeAmount
                      :amount="chartData.bondingSellPrice.toNumber()"
                      aettos
                    />
                    <FiatValue
                      :amount="chartData.bondingSellPrice.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendSupply') }}</h3>
                  <div>
                    <AeAmount
                      :token="chartData.tokenAddress"
                      :amount="chartData.totalSupply.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendInitialPrice') }}</h3>
                  <div>
                    <AeAmount
                      :amount="chartData.initialPrice.toNumber()"
                      aettos
                    />
                    <FiatValue
                      :amount="chartData.initialPrice.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendSpread') }}</h3>
                  <div>
                    <AeAmount
                      :amount="chartData.tokenSpread.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3>{{ $t('views.WordDetail.LegendReserve') }}</h3>
                  <div>
                    <AeAmount
                      :amount="chartData.tokenReserve.toNumber()"
                      aettos
                    />
                  </div>
                </div>
              </figcaption>
            </figure>
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
              <MessageInput
                v-model="description"
                :placeholder="$t('views.WordDetail.CreateVote.Placeholder')"
              />
              <i18n
                path="views.WordDetail.Release"
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
                  class="form-control"
                  placeholder="Enter aeternity address"
                >

                <AeButton
                  :disabled="!newVotePayout || !description.length"
                  @click="createVote"
                >
                  <IconCheckmarkCircle />
                  {{ $t('views.WordDetail.Initiate') }}
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
            <h3>{{ $t('views.WordDetail.Spread') }}</h3>
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
            <h3>{{ $t('views.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.Stake') }}</h3>
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
              <i18n
                v-else
                path="views.WordDetail.VoteTextZero"
                tag="p"
              >
                <template v-slot:token>
                  <span class="abbreviation">{{ selectedWord }}</span>
                </template>
                <template v-slot:spread>
                  <AeAmount
                    :amount="data.spread"
                    aettos
                  />
                </template>
              </i18n>
              <div class="buttons">
                <OutlinedButton
                  v-if="maxAmount <= 0"
                  class="green unpadded"
                >
                  {{ $t('Buy Tokens') }}
                </OutlinedButton>
                <AeButton
                  :disabled="maxAmount <= 0"
                  @click="showInitiate = !showInitiate"
                >
                  <IconCheckmarkCircle />
                  {{ $t('views.WordDetail.Initiate') }}
                </AeButton>
              </div>
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
import BondingCurve from '../components/BondingCurve.vue';
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
import MessageInput from '../components/MessageInput.vue';
import OutlinedButton from '../components/OutlinedButton.vue';
import { shiftDecimalPlaces, blockToDate, aeToAtoms } from '../utils';

export default {
  name: 'WordDetail',
  components: {
    TabBar,
    ActivityRibbon,
    AeAmount,
    FiatValue,
    WordBuySellButtons,
    BackButtonRibbon,
    BondingCurve,
    AeButton,
    IconCheckmarkCircle,
    IconPlus,
    Loader,
    VoteCard,
    MessageInput,
    OutlinedButton,
  },
  data() {
    return {
      wordRegistryState: null,
      selectedWord: null,
      saleContractAddress: null,
      ongoingVotes: [],
      pastVotes: [],
      myVotes: [],
      data: null,
      newVotePayout: '',
      activity: 'info',
      activeTab: 'ongoing',
      ribbonTabs: [{ icon: IconInfo, activity: 'info' }, { icon: IconPie, activity: 'voting' }]
        .map((t, i) => ({ text: this.$t(`views.WordDetail.RibbonTabs[${i}]`), ...t })),
      tabs: [{ tab: 'ongoing' }, { tab: 'past' }, { tab: 'my' }]
        .map((t, i) => ({ text: this.$t(`views.WordDetail.Tabs[${i}]`), ...t })),
      loading: false,
      progressMessage: '',
      showInitiate: false,
      description: '',
    };
  },
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
    chartData() {
      const decimals = this.tokenInfo[this.data.tokenAddress]?.decimals ?? 18;
      const initialPrice = new BigNumber(aeToAtoms(1)); // currently supports only hardcoded 1AE
      const sellPrice = new BigNumber(this.data.sellPrice);
      const buyPrice = new BigNumber(this.data.buyPrice);
      const totalSupply = new BigNumber(this.data.totalSupply);
      const bondingBuyPrice = new BigNumber(totalSupply.toNumber() + initialPrice.toNumber());
      const bondingSellPrice = totalSupply;
      const reserve = new BigNumber((bondingSellPrice * totalSupply) / 2);
      const spread = new BigNumber((bondingBuyPrice - bondingSellPrice) * totalSupply);

      return {
        totalSupply,
        initialPrice,
        decimals,
        buyPrice,
        sellPrice,
        bondingBuyPrice,
        bondingSellPrice,
        accumulatedSpread: this.data.spread,
        tokenAddress: this.data.tokenAddress,
        tokenSpread: new BigNumber(shiftDecimalPlaces(spread, -decimals)),
        tokenReserve: new BigNumber(shiftDecimalPlaces(reserve, -decimals)),
      };
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
  async mounted() {
    this.selectedWord = this.$route.params.word;
    this.loading = true;
    await this.reloadData();
    this.loading = false;
    EventBus.$on('reloadData', async (callback) => {
      await this.reloadData();
      if (callback) callback();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async reloadData() {
      this.wordRegistryState = await Backend.getWordRegistry('', '', this.selectedWord);
      this.saleContractAddress = this.wordRegistryState
        .find(({ word }) => word === this.selectedWord).sale;
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
      await this.$watchUntilTruly(() => this.$store.state.aeternity.sdk);
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
          description: this.description,
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

        await this.$store.dispatch('aeternity/tokenSaleMethod',
          {
            contractAddress: this.saleContractAddress,
            method: 'add_vote',
            args: [address],
          });
        await Backend.invalidateWordSaleVotesCache(this.saleContractAddress);
        this.description = '';
        this.newVotePayout = '';
        this.showInitiate = false;
      } catch (error) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: error.message,
          body: 'Vote was not created!',
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
  },
  metaInfo() {
    return { title: this.$t('views.WordDetail.Title', { word: this.selectedWord }) };
  },
};
</script>

<style lang="scss" scoped>
.word-detail {
  width: 624px;
  background: $actions_ribbon_background_color;

  ::v-deep .activity-ribbon {
    svg {
      height: 20px;
      width: auto;
    }
  }

  ::v-deep .ae-button,
  .outlined-button {
    font-size: 16px;
    height: 40px;

    svg {
      height: 24px;
      width: auto;
      margin-bottom: 2px;
    }
  }

  ::v-deep .tab-bar {
    svg {
      height: 20px;
      width: auto;
    }
  }

  h3 {
    color: $small_heading_color;
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1.2rem;
  }

  .asset_details__section {
    background-color: $actions_ribbon_background_color;
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
      background-color: $actions_ribbon_background_color;
    }

    .asset_details__section-content {
      padding: 1.5rem;

      .no-content {
        display: flex;
        flex-direction: column;

        h3 {
          color: $pure_white;
        }

        .buttons {
          display: flex;
          justify-content: center;
          align-items: center;

          button {
            width: 154px;
            height: 40px;

            &.outlined-button {
              margin-right: 32px;
            }
          }
        }
      }
    }
  }

  .asset_details__info {
    padding: 1.5rem;
    display: flex;
    flex-direction: row;

    @include mobile {
      flex-wrap: wrap;
    }

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
        width: 40%;
        margin: 8px;

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
      transform: scaleY(0);
    }

    .message-input {
      margin-bottom: 16px;
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

  .plus {
    transition: transform 0.5s;

    &.rotate {
      transform: rotate(45deg);
    }
  }

  .asset-details__chart {
    background-color: $super_dark;
    padding: 1.2rem 1rem 1rem 0.5rem;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    margin-left: 0.7rem;
    margin-top: 1.2rem;
  }

  .legend-item {
    flex: 33% 1 0;
    margin-bottom: 1.2rem;

    h3 {
      font-size: 0.75rem;

      &::before {
        border: 1.5px solid;
        border-radius: 100%;
        content: '';
        display: inline-block;
        height: 0.5rem;
        width: 0.5rem;
        margin-right: 0.5rem;
      }

      & + div {
        margin-left: 1rem;

        .ae-amount {
          margin-right: 0.1rem;
        }
      }
    }

    &:nth-child(1) h3::before {
      border-color: $custom_links_color;
    }

    &:nth-child(2) h3::before {
      border-color: $red_color;
    }

    &:nth-child(3) h3::before {
      border-color: $secondary_color;
    }

    &:nth-child(4) h3::before {
      border-color: $sunshade;
    }

    &:nth-child(5) h3::before {
      background-color: $secondary_color;
      border-color: $secondary_color;
    }

    &:nth-child(6) h3::before {
      background-color: $purple_heart;
      border-color: $purple_heart;
    }
  }
}
</style>
