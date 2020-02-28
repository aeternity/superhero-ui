<template>
    <span class="currency-value">
      (~ {{ fiatValue }} {{current.currency.toUpperCase()}})
    </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Currency from '../utils/currency'

  export default {
    name: 'FiatValue',
    props: ['amount'],
    data() {
      return {
        fiatValue: 0.00
      }
    },
    computed: {
      ...mapGetters(['current'])
    },
    async created () {
      new Currency().getRates().then(rates => {
          this.fiatValue = (this.amount * rates.aeternity[this.current.currency]).toFixed(2);
      }).catch(console.error);
    }
  }
</script>