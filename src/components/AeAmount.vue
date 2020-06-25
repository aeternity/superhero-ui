<template>
  <span class="ae-amount">
    <span>{{ roundedAmount }}</span>
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <span class="ae">{{ tokenSymbol || 'AE' }}</span>
  </span>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import util from '../utils/util';

export default {
  name: 'AeAmount',
  props: {
    amount: { type: String, required: true },
    round: { type: Number, default: 2 },
    aettos: { type: Boolean, required: false },
    token: { type: String, required: false, default: null },
  },
  computed: {
    ...mapState(['tokenInfo']),
    amountTokenInfo() {
      return this.token ? this.tokenInfo[this.token] : null;
    },
    tokenSymbol() {
      return this.amountTokenInfo ? this.amountTokenInfo.symbol : null;
    },
    roundedAmount() {
      if (!this.amount) {
        return 0;
      }

      const aeOrAettos = this.aettos ? util.atomsToAe(this.amount) : this.amount;
      const aeTokenAmount = this.amountTokenInfo
        ? util.unshiftDecimalPlaces(this.amount, this.amountTokenInfo.decimals)
        : aeOrAettos;

      return new BigNumber(aeTokenAmount).toFixed(this.round);
    },
  },
};
</script>

<style lang="scss" scoped>
.ae {
  color: $secondary_color;
  padding-left: 2px;
}

.ae-amount {
  color: $standard_font_color;
  line-height: 1;
}
</style>
