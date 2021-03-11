<template>
  <div class="word-detail">
    <BackButtonRibbon>
      <template #title>
        <span class="abbreviation">{{ selectedWord }}</span>
      </template>
    </BackButtonRibbon>

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabs"
      class="desktop"
    >
      <WordBuySellButtons
        v-if="saleContractAddress && activity === 'info'"
        :sale="saleContractAddress"
      />
    </ActivityRibbon>

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabsMobile"
      class="mobile"
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
            class="asset-details__asset abbreviation"
          >
            {{ selectedWord }}
          </div>
          <h3>{{ $t('views.WordDetail.Description') }}</h3>
          <div
            v-if="data"
            class="asset-details__description"
          >
            {{ data.description }}
          </div>
          <div
            v-if="!loading"
            class="chart-buttons"
          >
            <ButtonPlain
              :class="{ active: chart === 'history' }"
              @click="chart = 'history'"
            >
              {{ $t('views.WordDetail.PriceHistory') }}
            </ButtonPlain>
            <ButtonPlain
              :class="{ active: chart === 'curve' }"
              @click="chart = 'curve'"
            >
              {{ $t('views.WordDetail.BondingCurve') }}
            </ButtonPlain>
          </div>
          <Loader v-if="loading" />
          <div
            v-else-if="data"
            class="asset-details__chart"
          >
            <div
              v-if="chart === 'history'"
              class="price-history"
            >
              <TabBar
                v-model="timeScope"
                class="time-scope"
                :tabs="timeScopeTabs"
              />
              <Dropdown
                :options="timeScopeTabs"
                :selected="timeScope"
                :method="selectTimeScope"
                show-right
              >
                <template #displayValue>
                  {{ timeScopeText }}
                </template>
              </Dropdown>
            </div>
            <figure v-if="chart === 'history'">
              <PriceHistory
                :chartdata="priceHistory"
                :days-ago="+timeScope"
              />
              <figcaption class="legend">
                <div class="legend-item history">
                  <h3 class="buy-price">
                    {{ $t('views.WordDetail.LegendBuyPrice') }}
                  </h3>
                  <div>
                    <AeAmount
                      :amount="data.buyPrice"
                      aettos
                    />
                    <FiatValue
                      :amount="data.buyPrice"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item history">
                  <h3 class="sell-price">
                    {{ $t('views.WordDetail.LegendSellPrice') }}
                  </h3>
                  <div>
                    <AeAmount
                      :amount="data.sellPrice"
                      aettos
                    />
                    <FiatValue
                      :amount="data.sellPrice"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item history">
                  <h3 class="spread">
                    {{ $t('views.WordDetail.LegendSpread') }}
                  </h3>
                  <div>
                    <AeAmount
                      :amount="chartData.tokenSpread.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item history">
                  <h3 class="reserve">
                    {{ $t('views.WordDetail.LegendReserve') }}
                  </h3>
                  <div>
                    <AeAmount
                      :amount="chartData.tokenReserve.toNumber()"
                      aettos
                    />
                  </div>
                </div>
              </figcaption>
            </figure>
            <figure v-if="chart === 'curve'">
              <BondingCurve
                :data="chartData"
              />
              <figcaption class="legend">
                <div class="legend-item">
                  <h3 class="buy-price">
                    {{ $t('views.WordDetail.LegendBondingBuyPrice') }}
                  </h3>
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
                  <h3 class="sell-price">
                    {{ $t('views.WordDetail.LegendBondingSellPrice') }}
                  </h3>
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
                  <h3 class="supply">
                    {{ $t('views.WordDetail.LegendSupply') }}
                  </h3>
                  <div>
                    <AeAmount
                      :token="chartData.tokenAddress"
                      :amount="chartData.totalSupply.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3 class="initial-price">
                    {{ $t('views.WordDetail.LegendInitialPrice') }}
                  </h3>
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
                  <h3 class="spread">
                    {{ $t('views.WordDetail.LegendSpread') }}
                  </h3>
                  <div>
                    <AeAmount
                      :amount="chartData.tokenSpread.toNumber()"
                      aettos
                    />
                  </div>
                </div>
                <div class="legend-item">
                  <h3 class="reserve">
                    {{ $t('views.WordDetail.LegendReserve') }}
                  </h3>
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
          <ButtonPlain
            v-if="activeTab === 'ongoing' && maxAmount > 0"
            @click="showInitiate = !showInitiate"
          >
            <span
              v-if="!showInitiate"
              class="desktop"
            >{{ $t('views.WordDetail.NewVote') }}</span>
            <IconPlus
              class="plus"
              :class="{ rotate: showInitiate }"
            />
          </ButtonPlain>
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
              <div class="stake-label">
                {{ $t('views.WordDetail.CreateVote.YourMessage') }}
              </div>
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
                  :placeholder="$t('views.WordDetail.CreateVote.AddressPlaceholder')"
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
              no-parentheses
            />
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.Supply') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply"
              no-symbol
            />
            <span class="abbreviation">
              {{ selectedWord }}
            </span>
          </div>
          <div class="info-item">
            <h3>{{ $t('views.WordDetail.Stake') }}</h3>
            <AeAmount
              :token="data.tokenAddress"
              :amount="data.totalSupply / 2"
              no-symbol
            />
            <span class="abbreviation">
              {{ selectedWord }}
            </span>
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
                <template #balance>
                  <AeAmount
                    :token="data.tokenAddress"
                    :amount="maxAmount"
                  />
                </template>
                <template #spread>
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
                <template #token>
                  <span class="abbreviation">{{ selectedWord }}</span>
                </template>
                <template #spread>
                  <AeAmount
                    :amount="data.spread"
                    aettos
                  />
                </template>
              </i18n>
              <div class="buttons">
                <WordBuySellButtons
                  v-if="saleContractAddress"
                  :sale="saleContractAddress"
                >
                  <OutlinedButton
                    slot-scope="{ open }"
                    class="green unpadded"
                    :class="{ wide: maxAmount > 0 }"
                    @click="open"
                  >
                    <IconTokensBuySell />
                    <span class="mobile">{{ $t('views.WordDetail.BuyMobile') }}</span>
                    <span
                      v-if="maxAmount > 0"
                      class="desktop"
                    >{{ $t('views.WordDetail.BuyMore') }}</span>
                    <span
                      v-else
                      class="desktop"
                    >{{ $t('views.WordDetail.Buy') }}</span>
                  </OutlinedButton>
                </WordBuySellButtons>
                <AeButton
                  :disabled="maxAmount <= 0"
                  @click="showInitiate = !showInitiate"
                >
                  <IconCheckmarkCircle />
                  <span class="desktop">{{ $t('views.WordDetail.Initiate') }}</span>
                  <span class="mobile">{{ $t('views.WordDetail.InitiateMobile') }}</span>
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
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { EventBus } from '../utils/eventBus';
import Backend from '../utils/backend';
import ButtonPlain from '../components/ButtonPlain.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import BondingCurve from '../components/BondingCurve.vue';
import PriceHistory from '../components/PriceHistory.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';
import IconCheckmarkCircle from '../assets/iconCheckmarkCircle.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import IconTokensBuySell from '../assets/iconTokensBuySell.svg?icon-component';
import AeAmount from '../components/AeAmount.vue';
import FiatValue from '../components/FiatValue.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import AeButton from '../components/AeButton.vue';
import Loader from '../components/Loader.vue';
import VoteCard from '../components/VoteCard.vue';
import MessageInput from '../components/MessageInput.vue';
import OutlinedButton from '../components/OutlinedButton.vue';
import Dropdown from '../components/Dropdown.vue';
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
    ButtonPlain,
    BondingCurve,
    PriceHistory,
    AeButton,
    IconCheckmarkCircle,
    IconPlus,
    IconTokensBuySell,
    Loader,
    VoteCard,
    MessageInput,
    OutlinedButton,
    Dropdown,
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
      tabs: this.$t('views.WordDetail.Tabs'),
      loading: false,
      progressMessage: '',
      showInitiate: false,
      description: '',
      priceHistory: [],
      timeScope: '0',
      timeScopeText: 'All',
      chart: 'history',
      timeScopeTabs: this.$t('views.WordDetail.TimeScopeTabs'),
    };
  },
  computed: {
    ...mapState(['address', 'tokenInfo', 'tokenBalances']),
    ribbonTabs() {
      const icons = [IconInfo, IconPie];
      return this.$t('views.WordDetail.RibbonTabs')
        .map((t, i) => ({ ...t, icon: icons[i] }));
    },
    ribbonTabsMobile() {
      return this.ribbonTabs.map((t, i) => ({
        ...t,
        text: this.$t(`views.WordDetail.RibbonTabs[${i}].textMobile`),
      }));
    },
    ...mapGetters(['roundedTokenAmount']),
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
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  async created() {
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
      await this.loadPriceHistory();
    },
    async loadPriceHistory() {
      const timestampNow = Math.round(new Date().getTime());
      const price = await Backend.getPriceHistory(this.saleContractAddress);
      this.priceHistory = [
        ...price
          .map(({ timestamp, event, perToken }) => ({ timestamp, event, price: +perToken }))];
      this.priceHistory.push({
        timestamp: Math.min(...this.priceHistory.map((p) => p.timestamp)),
        event: 'Sell',
        price: 0,
      },
      {
        timestamp: timestampNow,
        event: 'Buy',
        price: +this.roundedTokenAmount(this.data.buyPrice, null, 2, true),
      },
      {
        timestamp: timestampNow,
        event: 'Sell',
        price: +this.roundedTokenAmount(this.data.sellPrice, null, 2, true),
      });
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
          hideIcon: true,
          primaryButtonText: 'OK',
        });
      } finally {
        EventBus.$emit('reloadData', () => {
          this.loading = false;
          this.progressMessage = '';
        });
      }
    },
    selectTimeScope(option) {
      this.timeScope = option.tab;
      this.timeScopeText = option.text;
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
  background-color: $actions_ribbon_background_color;

  ::v-deep .activity-ribbon {
    box-sizing: border-box;
    position: sticky;
    top: 56px;
    height: 65px;
    border-bottom: 1px solid $actions_ribbon_background_color;
    margin: 0;
    z-index: 1;

    &.mobile {
      display: none;
    }

    .filter-button {
      height: 40px;
      border-radius: 20px;
      font-size: 16px;

      svg {
        height: 24px;
        width: auto;
        margin-bottom: 2px;
        flex-shrink: 0;
      }

      @include desktop {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
        height: 56px;
        margin: 0;

        &.active,
        &:hover {
          background-color: transparent;
        }
      }
    }

    @include desktop {
      &.mobile {
        display: flex;
        top: 48px;
      }
      &.desktop { display: none; }
    }
  }

  ::v-deep .ae-button,
  .outlined-button {
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    height: 40px;

    svg {
      height: 24px;
      width: auto;
      margin-bottom: 2px;
    }

    .mobile {
      display: none;
    }

    @include desktop {
      .mobile {
        display: inline-block;
      }

      .desktop {
        display: none;
      }
    }
  }

  ::v-deep .tab-bar {
    height: 40px;
    font-size: 15px;
    position: sticky;
    top: 121px;
    z-index: 1;

    .button-plain {
      .plus {
        margin-bottom: 1px;
        transition: transform 0.5s;
        height: 20px;
        width: auto;

        &.rotate {
          transform: rotate(45deg);
        }
      }

      .desktop {
        @include desktop {
          display: none;
        }
      }

      &:hover {
        .plus {
          color: $custom_links_color;

          &.rotate {
            color: $red_color;
          }
        }
      }
    }

    @include mobile {
      top: 113px;
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
      padding-bottom: 16px;
    }

    .asset-details__description {
      color: $tip_note_color;
      padding-bottom: 16px;
    }

    .asset_details__section-content {
      padding: 8px 24px;
      font-size: 15px;
      font-weight: 400;

      h3 {
        margin-bottom: 8px;
      }

      .no-content {
        display: flex;
        flex-direction: column;

        h3 {
          color: $pure_white;
          font-size: 15px;
          font-weight: 500;
        }

        .buttons {
          display: flex;
          justify-content: center;
          align-items: center;

          ::v-deep.not-bootstrap-modal-content {
            @include mobile {
              margin-left: 0;
            }
          }

          button {
            width: 154px;
            height: 40px;

            &.outlined-button {
              margin-right: 32px;

              svg {
                height: 24px;
                width: auto;
              }

              @include desktop-only {
                &.wide {
                  width: 186px;
                }
              }
            }
          }
        }
      }

      .chart-buttons {
        .button-plain {
          padding: 8px 16px;
          font-weight: 500;
          font-size: 16px;
          line-height: 21px;
          color: $light_font_color;
          background-color: $light_color;
          opacity: 0.66;
          transition:
            color 0.3s ease-in-out,
            background-color 0.3s ease-in-out,
            opacity 0.3s ease-in-out;
          height: 40px;
          border: 1px solid $actions_ribbon_background_color;
          border-radius: 6px 6px 0 0;
          box-sizing: border-box;
          border-bottom: 0;

          &:hover:not(.active) {
            color: $tip_note_color;
            background-color: $tab_hover_color;
          }

          &.active {
            background-color: $chart_background_color;
            border-color: transparent;
            opacity: 1;
            cursor: default;
          }
        }
      }
    }
  }

  .asset_details__info {
    padding: 1.5rem;
    display: flex;
    flex-direction: row;

    @include desktop {
      flex-wrap: wrap;
    }

    .info-item {
      flex-shrink: 1;
      font-size: 15px;
      line-height: 19px;
      display: flex;
      flex-direction: column;
      background: $super_dark;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      margin-right: 16px;
      padding: 16px;
      transition: background 0.3s ease-in-out;
      min-height: 112px;

      h3 {
        font-size: 15px;
        font-weight: 700;
        transition: color 0.3s ease-in-out;
        color: $light_font_color;
        margin-bottom: 9px;
      }

      &:hover {
        background: $buttons_background;

        h3 {
          color: $tip_note_color;
        }
      }

      .abbreviation {
        display: block;
        width: 100%;
        word-wrap: break-word;
      }

      @include desktop {
        width: 44%;
        margin: 8px;
      }
    }
  }

  .initiate-vote {
    margin-bottom: 0.1rem;
    padding: 1.2rem;
    font-size: 15px;
    font-weight: 500;

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
        font-size: 14px;
        height: 40px;

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

  .asset-details__chart {
    background-color: $chart_background_color;
    padding: 1.2rem 1rem 1rem 0.5rem;

    .price-history {
      display: flex;
      justify-content: flex-end;
      position: relative;

      ::v-deep .time-scope {
        background-color: transparent;
        height: 36px;
        width: 100%;
        justify-content: flex-end;
        z-index: 0;
        position: absolute;
        top: 0;
        right: 0;

        .right {
          display: none;
        }

        button {
          margin: 6px 4px;
          font-size: 14px;
          line-height: 23px;
          color: $light_font_color;
          padding: 0 16px;
          background-color: $tab_hover_color;
          border-radius: 6px;
          border: 0;
          white-space: nowrap;

          &:hover:not(.active) {
            background-color: $actions_ribbon_background_color;
            color: $tip_note_color;
          }

          &.active {
            background-color: rgba(0, 255, 157, 0.1);
            color: $custom_links_color;
          }
        }

        @include desktop {
          display: none;
        }
      }

      .dropdown {
        @include desktop-only {
          display: none;
        }
      }
    }
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

    &.history {
      flex: 50% 1 0;
    }

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

      &.buy-price::before {
        border-color: $custom_links_color;
      }

      &.sell-price::before {
        border-color: $red_color;
      }

      &.supply::before {
        border-color: $secondary_color;
      }

      &.initial-price::before {
        border-color: $sunshade;
      }

      &.spread::before {
        background-color: $secondary_color;
        border-color: $secondary_color;
      }

      &.reserve::before {
        background-color: $purple_heart;
        border-color: $purple_heart;
      }
    }
  }
}
</style>
