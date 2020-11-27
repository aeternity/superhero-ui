<template>
  <span class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
      :token="token"
    />
    &nbsp;<FiatValue
      v-bind="!token ? $attrs : { amount: 0 }"
    />
  </span>
</template>

<script>
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';

export default {
  components: {
    FiatValue,
    AeAmount,
  },
  props: {
    token: { type: String, default: null },
  },
};
</script>
