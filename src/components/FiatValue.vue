<template>
    <span class="currency-value" v-if="currencyRates.aeternity">
      (~ {{ fiatValue }} <span class="currency-sign">{{settings.currency.toUpperCase()}}</span>)
    </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BigNumber from 'bignumber.js'

  export default {
    name: 'FiatValue',
    props: ['amount'],

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
