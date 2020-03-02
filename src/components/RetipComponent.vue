<template>
  <div v-if="toggleForm" class="clearfix retip__container">
    <div class="input-group mr-1 float-left">
      <input type="number" step="0.000001" v-model="value" @input="onValueChange" class="form-control" aria-label="Default">
      <div class="input-group-append">
        <span class="input-group-text append__ae"> <span class="ae">AE</span>&nbsp;(~ {{current.currency.toUpperCase()}} {{ fiatValue }} )</span>
      </div>
    </div>
    <button class="btn btn-primary retip__button float-right" @click="submitRetip()">Retip</button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Currency from '../utils/currency'
  import BigNumber from 'bignumber.js'

  export default {
    name: 'FiatValue',
    props: ['retip', 'tipid', 'show', 'toggleRetip'],
    data() {
      return {
        fiatValue: 0.00,
        value: 0
      }
    },
    computed: {
      ...mapGetters(['current']),
      toggleForm(){
        this.resetForm();
        return this.show;
      }
    },
    methods:{
      submitRetip(){
        this.retip(this.tipid, this.value)
        this.$emit('toggleRetip', false)
      },
      resetForm(){
        this.value = 0;
        this.fiatValue = 0.00;
      },
      onValueChange(data){
        this.getFiatVal();
      },
      async getFiatVal(){
        if(this.value.length == 0){
          this.fiatValue = 0.00;
          return;
        }
        new Currency().getRates().then(rates => {
            this.fiatValue = (new BigNumber(parseFloat(this.value)).multipliedBy(rates.aeternity[this.current.currency])).toFixed(2);
        }).catch(console.error);
      }
      
    },
    async created () {
      this.getFiatVal();
    }
  }
</script>

<style lang="scss" scoped>
 @import "../styles/base";
 
.input-group{
  border: .065rem solid $custom_links_color;
  border-radius: .25rem;
  width: calc(100% - 4rem);
  .input-group-append{
    .ae{
      color: $secondary_color;
    }
    span.append__ae {
      font-size: 0.75rem;
      background: $background_color;
      color: $light_font_color;
      cursor: default;
    }
  }
}
.retip__button{
  margin-top: 0.1rem;
  background-color: $custom_links_color; 
  color: $standard_font_color;
  border: none;
}
.retip__container{
  background-color: black;
  border-radius: .5rem;
  padding: 1rem;
  position: absolute;
  min-width: 19rem;
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .input-group .form-control, .input-group .input-group-append span.append__ae{
      font-size: .5rem;
    }
    .retip__container{
      min-width: 13rem;
      padding: .5rem;
    }
    .retip__button{
      font-size: .5rem;
    }
}
</style>