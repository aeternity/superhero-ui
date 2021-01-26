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
          @click="order('buyprice', 'desc')"
        >
          {{ $t('components.WordListing.BuyPrice') }}
        </span>
        <IconSort
          v-if="ordering === 'buyprice'"
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

    <div
      v-else
      class="word-listing"
    >
      <div class="word-listing-column asset-column">
        <RouterLink
          class="link"
          :to="{ name: 'word-detail', params: { word: data.word } }"
        >
          {{ data.word }}
        </RouterLink>
      </div>
      <div class="word-listing-column">
        <AeAmountFiat
          :amount="data.buyPrice"
          aettos
        />
      </div>
      <div class="word-listing-column">
        <AeAmount
          :amount="data.totalSupply"
          :token="data.tokenAddress"
          no-symbol
          class="supply"
        />
      </div>

      <WordBuySellButtons :sale="data.sale" />
    </div>
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
  },
  data: () => ({
    ordering: 'buyprice',
    direction: 'desc',
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

  .iconSort {
    margin-top: -0.2rem;

    &.asc {
      margin-top: 0.2rem;
      transform: rotate(180deg);
    }
  }

  font-size: 0.75rem;
  padding: 0.4rem 0;
  margin-bottom: 0.05rem;
  background-color: $light_color;
  display: flex;

  .heading-text.active {
    color: $custom_links_color;
  }

  .asset-column {
    font-weight: 500;
    padding-left: 1.2rem;
  }

  .word-listing-column {
    flex: 0 0 25%;
    width: 25%;

    .supply {
      color: $tip_note_color;
    }
  }

  &.word-listing-heading {
    font-size: 0.8rem;
    font-weight: 500;
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
