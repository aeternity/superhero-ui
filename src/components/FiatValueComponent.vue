<template>
    <span class="currency-value">
      (~ {{ fiatValue }} {{current.currency.toUpperCase()}})
    </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BigNumber from 'bignumber.js'

  export default {
    name: 'FiatValue',
    props: ['amount'],

    computed: {
      ...mapGetters(['current', 'currencyRates']),
      fiatValue() {
        if(!this.amount){
          return 0
        }
        return new BigNumber(this.amount).multipliedBy(this.currencyRates.aeternity[this.current.currency]).toFixed(2);
      }
    }
  }
</script>
