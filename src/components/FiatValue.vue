<template>
  <span
    v-if="rate"
    class="fiat-value"
  >
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <span>(~ {{ fiatValue }})</span>
  </span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FiatValue',
  props: {
    amount: { type: [String, Number], default: 0 },
  },
  computed: mapState({
    rate: ({ selectedCurrency, backend: { prices } }) => prices[selectedCurrency],
    fiatValue({ selectedCurrency }) {
      if (!this.amount) {
        return 0;
      }
      return (this.amount * this.rate).toLocaleString('en-US', { style: 'currency', currency: selectedCurrency });
    },
  }),
};
</script>
