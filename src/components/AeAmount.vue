<template>
  <span class="ae-amount">
    <span>{{ roundedAmount }}</span>
    <span class="ae">AE</span>
  </span>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  name: 'AeAmount',
  props: ['amount', 'round'],

  computed: {
    roundedAmount() {
      if (!this.amount) {
        return 0;
      }
      return new BigNumber(this.amount).toFixed(this.round);
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
