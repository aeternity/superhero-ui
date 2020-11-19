<template>
  <div class="row">
    <div class="col-md-3">
      <RouterLink
        class="link"
        :to="{ name: 'word-detail', params: { word } }"
      >
        {{ word }}
      </RouterLink>
    </div>
    <div class="col-md-3">
      <AeAmount
        v-if="buyPrice"
        :amount="buyPrice"
      />
      <Loading
        v-else
        :small="true"
      />
    </div>
    <div class="col-md-3">
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
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import AeAmount from './AeAmount.vue';
import Loading from './Loading.vue';
import WordBuySellButtons from './WordBuySellButtons.vue';

export default {
  name: 'WordListing',
  components: {
    WordBuySellButtons,
    AeAmount,
    Loading,
  },
  props: {
    word: { type: String, required: true },
    sale: { type: String, required: true },
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
.link {
  color: $secondary_color;
  text-decoration: none;
}

h2 {
  margin-top: 1rem;
}

.label {
  color: $light_font_color;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;

  @include desktop {
    margin-bottom: 0.4rem;
    line-height: 0.9rem;
  }
}
</style>
