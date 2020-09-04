<template>
  <span class="ae-amount-fiat">
    <AeAmount
      v-bind="$attrs"
    />
    &nbsp;<FiatValue
      v-bind="$attrs"
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
};
</script>
