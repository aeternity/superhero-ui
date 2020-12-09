<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <div
      v-if="heading"
      class="word-listing word-listing-heading"
    >
      <div class="word-listing-column asset-column">
        Asset
      </div>
      <div class="word-listing-column">
        Buy Price <IconSort />
      </div>
      <div class="word-listing-column">
        Supply
      </div>
      <div class="word-listing-column">
        Market
      </div>
    </div>
    <div
      v-else
      class="word-listing"
    >
      <div class="word-listing-column asset-column">
        <RouterLink
          class="link"
          :to="{ name: 'word-detail', params: { word } }"
        >
          {{ word }}
        </RouterLink>
      </div>
      <div class="word-listing-column">
        <AeAmountFiat
          v-if="buyPrice"
          :amount="buyPrice"
        />
        <Loading
          v-else
          :small="true"
        />
      </div>
      <div class="word-listing-column">
        <AeAmount
          v-if="totalSupply !== null && tokenAddress"
          :amount="totalSupply"
          :token="tokenAddress"
        />
        <Loading
          v-else
          :small="true"
        />
      </div>

      <WordBuySellButtons :sale="sale" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import AeAmountFiat from './AeAmountFiat.vue';
import Loading from './Loading.vue';
import WordBuySellButtons from './WordBuySellButtons.vue';
import IconSort from '../assets/iconSort.svg?icon-component';

export default {
  name: 'WordListing',
  components: {
    WordBuySellButtons,
    AeAmountFiat,
    Loading,
    IconSort,
  },
  props: {
    word: { type: String, default: null },
    sale: { type: String, default: null },
    heading: { type: Boolean },
  },
  data: () => ({
    contract: null,
    buyPrice: null,
    sellPrice: null,
    buyAmount: 0,
    sellAmount: 0,
    totalSupply: null,
    tokenAddress: null,
    tokenContract: null,
    showBuyModal: false,
    showSellModal: false,
    loading: true,
  }),
  computed: {
    ...mapState(['address', 'balance', 'tokenBalances']),
    tokenBalance() {
      const balance = this.tokenBalances && this.tokenAddress
        && this.tokenBalances.find((t) => t.token === this.tokenAddress);

      return balance ? balance.balance : '0';
    },
  },
  mounted() {
    this.loadWordData();
  },
  methods: {
    async loadWordData() {
      this.totalSupply = null;
      this.buyPrice = null;

      const data = await Backend.getWordSale(this.sale);
      this.tokenAddress = data.tokenAddress;
      this.totalSupply = data.totalSupply;
      this.buyPrice = data.buyPrice;
      this.sellPrice = data.sellPrice;

      this.loading = false;
      this.buyAmount = 0;
      this.sellAmount = 0;
      this.showSellModal = false;
      this.showBuyModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>

.word-listing {
  font-size: 0.75rem;
  padding: 0.4rem 0;
  margin-bottom: 0.05rem;
  background-color: $light_color;
  display: flex;

  .asset-column {
    font-weight: 500;
    padding-left: 1.2rem;
  }

  .word-listing-column {
    flex: 0 0 25%;
    width: 25%;
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
