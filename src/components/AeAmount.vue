<template>
  <span class="ae-amount">
    <span>{{ roundedAmount }}</span>
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <span class="ae">AE</span>
  </span>
</template>

<script>
import BigNumber from 'bignumber.js';
import util from '../utils/util';

export default {
  name: 'AeAmount',
  props: {
    amount: { type: [String, Number], default: 0 },
    round: { type: Number, default: 2 },
    aettos: { type: Boolean, required: false },
  },
  computed: {
    roundedAmount() {
      if (!this.amount) {
        return 0;
      }
      return new BigNumber(this.aettos ? util.atomsToAe(this.amount) : this.amount)
        .toFixed(this.round);
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
