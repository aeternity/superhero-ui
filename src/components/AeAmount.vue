<template>
  <span class="ae-amount">
    <template>{{ roundedAmount }}</template>
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <span class="ae">{{ tokenSymbol || 'AE' }}</span>
  </span>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { atomsToAe, shiftDecimalPlaces } from '../utils';

export default {
  props: {
    amount: { type: [String, Number], default: 0 },
    round: { type: Number, default: 2 },
    aettos: { type: Boolean, required: false },
    token: { type: String, default: null },
  },
  computed: {
    ...mapState({
      amountTokenInfo({ tokenInfo }) {
        return this.token ? tokenInfo[this.token] : null;
      },
    }),
    tokenSymbol() {
      return this.amountTokenInfo ? this.amountTokenInfo.symbol : null;
    },
    roundedAmount() {
      const aeOrAettos = this.aettos ? atomsToAe(this.amount) : this.amount;
      const aeTokenAmount = this.amountTokenInfo
        ? shiftDecimalPlaces(this.amount, -this.amountTokenInfo.decimals)
        : aeOrAettos;

      return new BigNumber(aeTokenAmount).toFixed(this.round);
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-amount {
  color: $standard_font_color;

  .ae {
    color: $secondary_color;
    padding-left: 2px;
  }
}
</style>
