<template>
<div class="position-relative wrapper">
  <img @click="toggleRetip(!show)" class="retip__icon" src="../assets/heart.svg">
  <div class="clearfix retip__container" v-if="show">
    <div class="input-group mr-1 float-left">
      <input type="number" step="0.000001" v-model="value" @input="onValueChange" class="form-control" aria-label="Default">
      <div class="input-group-append">
        <span class="input-group-text append__ae"> <span class="ae">AE</span>&nbsp;(~ {{current.currency.toUpperCase()}} {{ fiatValue }} )</span>
      </div>
    </div>
    <button class="btn btn-primary retip__button float-right" @click="retip()">Retip</button>
  </div>
</div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import util from '../utils/util';
  import Currency from '../utils/currency'
  import BigNumber from 'bignumber.js'
  import aeternity from '../utils/aeternity';
  import {EventBus} from '../utils/eventBus';


  export default {
    name: 'RetipComponent',
    props: ['tipid'],
    data() {
      return {
        fiatValue: 0.00,
        value: 0,
        show: false
      }
    },
    computed: {
      ...mapGetters(['current']),
    },
    methods:{
      toggleRetip(flag){
        this.show = flag;
        if(flag){
          this.resetForm();
        }
      },
      async retip() {
        let amount = util.aeToAtoms(this.value);
        await aeternity.contract.methods.retip(this.tipid, {amount: amount}).catch(console.error);
        EventBus.$emit('reloadData');
        this.show = false;
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
      let _this = this;
      this.getFiatVal();

      window.addEventListener('click', function(e){
        if (!_this.$el.contains(e.target)){
          _this.show = false
        } 
      })
    }
  }
</script>

<style lang="scss" scoped>
 @import "../styles/base";
 .retip__icon{
   &:hover{
     cursor: pointer;
   }
 }
 .wrapper{
   display: inline-block;
 }
.wrapper .input-group .input-group-append span.append__ae {
    background: $background_color;
    color: $light_font_color;
}
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