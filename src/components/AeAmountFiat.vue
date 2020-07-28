<template>
  <span class="ae-amount-fiat">
    <AeAmount v-bind="$attrs" :token="token" />
    &nbsp;<FiatValue v-if="!token" v-bind="$attrs" />
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
    token: { type: String, required: false, default: null },
  },
};
</script>
