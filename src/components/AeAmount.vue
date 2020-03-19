<template>
    <span class="ae-amount">
      <span>{{ roundedAmount }}</span>
    </span>
</template>

<script>
import { mapGetters } from 'vuex';
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
