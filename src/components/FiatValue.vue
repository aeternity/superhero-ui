<template>
  <span
    v-if="rate"
    class="fiat-value"
  >
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <template>(~ {{ fiatValue }})</template>
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
      return (this.amount * this.rate).toLocaleString(
        'en-US', { style: 'currency', currency: selectedCurrency },
      );
    },
  }),
};
</script>

<style lang="scss" scoped>
.fiat-value {
  color: $light_font_color;
}
</style>
