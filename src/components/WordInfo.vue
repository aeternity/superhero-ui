<template>
  <div class="word-info asset_details__section">
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
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import Backend from '../utils/backend';
import ButtonPlain from './ButtonPlain.vue';
import BondingCurve from './BondingCurve.vue';
import PriceHistory from './PriceHistory.vue';
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';
import TabBar from './TabBar.vue';
import Loader from './Loader.vue';
import Dropdown from './Dropdown.vue';
import { shiftDecimalPlaces, aeToAtoms } from '../utils';

export default {
  name: 'WordInfo',
  components: {
    TabBar,
    AeAmount,
    FiatValue,
    ButtonPlain,
    BondingCurve,
    PriceHistory,
    Loader,
    Dropdown,
  },
  props: {
    data: { type: Object, required: true },
    selectedWord: { type: String, required: true },
    saleContractAddress: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      priceHistory: [],
      timeScope: '0',
      timeScopeText: 'All',
      chart: 'history',
    };
  },
  computed: {
    ...mapState(['address', 'tokenInfo']),
    ...mapGetters(['roundedTokenAmount']),
    timeScopeTabs() {
      const activities = ['1', '3', '7', '30', '90', '365', '0'];
      return this.$t('views.WordDetail.TimeScopeTabs')
        .map((t, i) => ({ text: t, tab: activities[i] }));
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
  },
  mounted() {
    this.$watch(
      ({ data, selectedWord }) => [data, selectedWord],
      () => this.reloadData(),
      { immediate: true },
    );
  },
  methods: {
    async reloadData() {
      this.loading = true;
      await this.loadPriceHistory();
      this.loading = false;
    },
    async loadPriceHistory() {
      const timestampNow = Math.round(new Date().getTime());
      await this.$watchUntilTruly(() => this.saleContractAddress);
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
    selectTimeScope(option) {
      this.timeScope = option.tab;
      this.timeScopeText = option.text;
    },
  },
};
</script>

<style lang="scss" scoped>
.word-info {
  h3 {
    color: $small_heading_color;
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1.2rem;
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
            background-color: rgba($custom_links_color, 0.1);
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
