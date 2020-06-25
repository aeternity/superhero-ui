<template>
  <div class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
      :amount="amount"
      :token="token"
    />
    <FiatValue
      v-if="!token"
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
    token: { type: String, required: false, default: null },
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
