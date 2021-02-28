<template>
  <span
    v-if="fiatValue"
    class="fiat-value"
  >
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <template v-if="noParentheses">≈ {{ fiatValue }}</template>

    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <template v-else>(≈ {{ fiatValue }})</template>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { shiftDecimalPlaces } from '../utils';

export default {
  props: {
    amount: { type: [String, Number], default: 0 },
    aettos: { type: Boolean },
    token: { type: String, default: null },
    noParentheses: { type: Boolean },
    noSymbol: { type: Boolean },
    currency: { type: String, default: null },
  },
  computed: mapState({
    showCurrency({ selectedCurrency }) {
      return (this.currency || selectedCurrency).toLowerCase();
    },
    rate({ backend: { prices } }) {
      return prices[this.showCurrency];
    },
    fiatValue() {
      if (!this.rate) return null;
      if (this.token && !this.tokenData) {
        return (0).toLocaleString('en-US', { style: 'currency', currency: this.showCurrency });
      }

      const decimals = this.token ? -this.tokenData.decimals : -18;
      const shiftBy = this.aettos ? decimals : 0;
      const price = this.token
        ? shiftDecimalPlaces(this.tokenData.price, -this.tokenData.decimals)
        : 1;

      const fiatValue = new BigNumber(shiftDecimalPlaces(this.amount, shiftBy))
        .multipliedBy(price).multipliedBy(this.rate)
        .toNumber() || 0;

      return this.noSymbol ? fiatValue.toFixed(2) : fiatValue
        .toLocaleString('en-US', { style: 'currency', currency: this.showCurrency });
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
