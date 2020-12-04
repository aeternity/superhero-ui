<template>
  <span
    v-if="fiatValue"
    class="fiat-value"
  >
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <template>(~ {{ fiatValue }})</template>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { shiftDecimalPlaces } from '../utils';

export default {
  props: {
    amount: { type: [String, Number], default: 0 },
    aettos: { type: Boolean, required: false },
    token: { type: String, default: null },
  },
  computed: mapState({
    rate: ({ selectedCurrency, backend: { prices } }) => prices[selectedCurrency],
    fiatValue({ selectedCurrency }) {
      if (!this.rate) return null;
      if (this.token && !this.tokenData) return null;

      const shiftAettos = this.aettos ? -18 : 0;
      const shiftBy = this.token ? -this.tokenData.decimals : shiftAettos;
      const price = this.token ? this.tokenData.price : 1;

      return new BigNumber(shiftDecimalPlaces(this.amount, shiftBy))
        .multipliedBy(price).multipliedBy(this.rate)
        .toNumber()
        .toLocaleString('en-US', { style: 'currency', currency: selectedCurrency });
    },
    tokenData({ tokenPrices, tokenInfo }) {
      if (!this.token) return null;
      if (!tokenInfo[this.token] || !tokenPrices[this.token]) return null;

      return {
        decimals: tokenInfo[this.token].decimals,
        price: tokenPrices[this.token],
      };
    },
  }),
};
</script>

<style lang="scss" scoped>
.fiat-value {
  color: $light_font_color;
}
</style>
