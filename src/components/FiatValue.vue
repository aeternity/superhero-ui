<template>
  <span
    v-if="currencyRates.aeternity"
    class="currency-value"
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
  computed: {
    ...mapState(['settings', 'currencyRates']),
    fiatValue() {
      const rate = this.currencyRates.aeternity[this.settings.currency];
      if (!this.amount) {
        return 0;
      }
      return (this.amount * rate).toLocaleString('en-US', { style: 'currency', currency: this.settings.currency });
    },
  },
};
</script>
