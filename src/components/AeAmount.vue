<template>
  <span class="ae-amount">
    <span>{{ roundedAmount }}</span>
    <span class="ae">AE</span>
  </span>
</template>

<script>
import BigNumber from 'bignumber.js';
import util from '../utils/util';

export default {
  name: 'AeAmount',
  props: {
    amount: { type: String, required: true },
    round: { type: Number, required: true },
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
  padding-left: 2px;
  color: $secondary_color;
}
</style>
