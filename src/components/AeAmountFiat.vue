<template>
  <div class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
      :amount="amount"
    />
    <FiatValue
      v-bind="$attrs"
      :amount="amount"
    />
  </div>
</template>

<script>
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';

export default {
  name: 'AeAmountFiat',
  components: {
    FiatValue,
    AeAmount,
  },
  props: {
    amount: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
.ae-amount-fiat {
  display: flex;
  align-items: center;

  .currency-value {
    font-size: 0.7rem;
    color: $light_font_color;
    margin-left: 0.1rem;
  }
}
</style>
