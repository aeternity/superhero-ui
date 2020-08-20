<template>
  <div class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
      :token="token"
    />
    <FiatValue
      v-if="!token"
      v-bind="$attrs"
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
    token: { type: String, default: null },
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
