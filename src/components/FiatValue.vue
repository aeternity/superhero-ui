<template>
    <span class="currency-value" v-if="currencyRates.aeternity">
      <span v-if="withoutBrackets">{{ fiatValue }} <span class="currency-sign">{{settings.currency.toUpperCase()}}</span></span>
      <span v-else>(~ {{ fiatValue }} <span class="currency-sign">{{settings.currency.toUpperCase()}}</span>)</span>
    </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BigNumber from 'bignumber.js'

  export default {
    name: 'FiatValue',
    props: ['amount', 'withoutBrackets'],

    computed: {
      ...mapGetters(['settings', 'currencyRates']),
      fiatValue() {
        if (!this.amount) {
          return 0
        }
        return new BigNumber(this.amount).multipliedBy(this.currencyRates.aeternity[this.settings.currency]).toFixed(2);
      }
    }
  }
</script>
