<template>
  <div>
    <div
      v-if="heading"
      class="word-listing word-listing-heading"
    >
      <div class="word-listing-column asset-column">
        <span
          class="heading-text"
          @click="order('asset', 'desc')"
        >
          {{ $t('components.WordListing.Asset') }}
        </span>
        <IconSort
          v-if="ordering === 'asset'"
          :class="{ asc: direction === 'asc' }"
          @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')"
        />
      </div>

      <div class="word-listing-column">
        <span
          class="heading-text"
          :class="{ green: showBuy, red: !showBuy }"
          @click="switchBuySell"
        >
          {{ $t(`components.WordListing.${showBuy ? 'BuyPrice' : 'SellPrice'}`) }}
        </span>
        <IconSort
          v-if="ordering === 'buyprice' || ordering === 'sellprice'"
          :class="{ asc: direction === 'asc' }"
          @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')"
        />
      </div>

      <div class="word-listing-column">
        <span
          class="heading-text"
          @click="order('supply', 'desc')"
        >
          {{ $t('components.WordListing.Supply') }}
        </span>
        <IconSort
          v-if="ordering === 'supply'"
          :class="{ asc: direction === 'asc' }"
          @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')"
        />
      </div>

      <div class="word-listing-column">
        <span class="heading-text">{{ $t('components.WordListing.Market') }}</span>
      </div>
    </div>

    <RouterLink
      v-else
      class="word-listing word-row"
      tag="div"
      :to="{ name: 'word-detail', params: { word: data.word } }"
    >
      <div
        class="word-listing-column asset-column link"
      >
        {{ data.word }}
      </div>
      <div class="word-listing-column">
        <AeAmountFiat
          :amount="showBuyValue ? data.buyPrice : data.sellPrice"
          aettos
          @click.native.stop
        />
      </div>
      <div class="word-listing-column">
        <AeAmount
          :amount="data.totalSupply"
          :token="data.tokenAddress"
          no-symbol
          class="supply"
          @click.native.stop
        />
      </div>

      <WordBuySellButtons
        :sale="data.sale"
        @click.native.stop
      />
    </RouterLink>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AeAmountFiat from './AeAmountFiat.vue';
import AeAmount from './AeAmount.vue';
import WordBuySellButtons from './WordBuySellButtons.vue';
import IconSort from '../assets/iconSort.svg?icon-component';

export default {
  name: 'WordListing',
  components: {
    WordBuySellButtons,
    AeAmountFiat,
    AeAmount,
    IconSort,
  },
  props: {
    data: { type: Object, default: null },
    heading: { type: Boolean },
    showBuyValue: { type: Boolean },
  },
  data: () => ({
    ordering: 'buyprice',
    direction: 'desc',
    showBuy: true,
  }),
  computed: {
    ...mapState(['address', 'balance', 'tokenBalances']),
    tokenBalance() {
      const balance = this.tokenBalances && this.data.tokenAddress
        && this.tokenBalances.find((t) => t.token === this.data.tokenAddress);

      return balance ? balance.balance : '0';
    },
  },
  methods: {
    switchBuySell() {
      this.showBuy = !this.showBuy;
      this.ordering = this.showBuy ? 'buyprice' : 'sellprice';
      this.$emit('show-buy', this.showBuy);
    },
    order(ordering, direction) {
      this.ordering = ordering;
      this.direction = direction;
      this.$emit('order', ordering, direction);
    },
  },
};
</script>

<style lang="scss" scoped>
.word-listing {
  color: $light_font_color;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.4rem 0;
  margin-bottom: 0.05rem;
  transition: background-color 0.3s ease-in-out;
  background-color: $light_color;
  display: flex;
  height: 48px;

  &.word-row {
    &:hover {
      background-color: $buttons_background;
      cursor: pointer;
    }
  }

  .iconSort {
    margin-top: -0.2rem;
    height: 17px;
    width: auto;
    color: $standard_font_color;
    cursor: pointer;
    transition: color 0.3s ease-in-out;

    &.asc {
      margin-top: 0;
      transform: rotate(180deg);
    }

    &:hover {
      color: $custom_links_color;
    }
  }

  .heading-text {
    transition: color 0.3s ease-in-out;

    &.green {
      color: $custom_links_color;
      cursor: pointer;
    }

    &.red {
      color: $red_color;
      cursor: pointer;
    }
  }

  .word-listing-column {
    flex: 0 0 25%;
    width: 25%;

    .supply {
      color: $tip_note_color;
    }

    svg {
      height: 21px;
      width: auto;
    }
  }

  &.word-listing-heading {
    height: 56px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .asset-column {
    font-weight: 500;
    padding-left: 24px;
    width: 122px;
  }

  .link {
    color: $secondary_color;
    text-decoration: none;
  }

  .word-listinglabel {
    color: $light_font_color;
    font-size: 0.7rem;
    margin-bottom: 0.5rem;

    @include desktop {
      margin-bottom: 0.4rem;
      line-height: 0.9rem;
    }
  }
}

</style>
