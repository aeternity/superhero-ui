<template>
  <div class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
      :amount="amount"
      :round="round"
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
    round: { type: Number, default: 2 },
  },
};
</script>

<style lang="scss" scoped>
.ae-amount-fiat {
  display: flex;

  .currency-value {
    font-size: 0.7rem;
    margin-left: 0.1rem;
  }
}
</style>
