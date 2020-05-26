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
import { mapGetters } from 'vuex';

export default {
  name: 'FiatValue',
  props: {
    amount: { type: String, required: true },
  },
  computed: {
    ...mapGetters(['settings', 'currencyRates']),
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
