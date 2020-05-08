<template>
  <span
    v-if="currencyRates.aeternity"
    class="currency-value"
  >
    <span v-if="withoutBrackets">
      <span class="currency-sign">{{ currencySign }}</span>{{ fiatValue }}
    </span>
    <span v-else-if="displaySymbol">
      (~ <span class="currency-sign">{{ currencySign }}</span>{{ fiatValue }})
    </span>
    <span v-else>
      (~ <span class="currency-sign">{{ currencySign }}</span>{{ fiatValue }})
    </span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { currencySigns } from '../utils/util';

export default {
  name: 'FiatValue',
  props: {
    amount: { type: String, required: true },
    withoutBrackets: { type: Boolean },
    displaySymbol: { type: Boolean },
  },
  computed: {
    ...mapGetters(['settings', 'currencyRates']),
    fiatValue() {
      if (!this.amount) {
        return 0;
      }
      return new BigNumber(this.amount)
        .multipliedBy(this.currencyRates.aeternity[this.settings.currency]).toFixed(2);
    },
    currencySign() {
      return this.settings && this.settings.currency ? currencySigns[this.settings.currency] : '';
    },
  },
};
</script>
