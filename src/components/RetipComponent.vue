<template>
<div class="d-inline-block">
  <div class="overlay" @click="toggleRetip(false)" v-if="show"></div>
  <div class="position-relative wrapper" v-on:click.stop>
    <img @click="toggleRetip(!show)" class="retip__icon" src="../assets/heart.svg">
    <div class="clearfix retip__container" v-show="show">
      <div class="text-center spinner__container" v-show="showLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="text-center mb-2" v-show="error && !showLoading">An error occured while sending retip</div>
      <div class="input-group mr-1 float-left" v-show="!showLoading">
        <input type="number" step="0.1" v-model="value" class="form-control" aria-label="Default">
        <div class="input-group-append">
          <span class="input-group-text append__ae"> <span class="ae">AE</span>&nbsp;<fiat-value :amount="value"></fiat-value></span>
        </div>
      </div>
      <button class="btn btn-primary retip__button float-right" @click="retip()" v-show="!showLoading">Retip</button>
    </div>
  </div>
</div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import util from '../utils/util';
  import aeternity from '../utils/aeternity';
  import {EventBus} from '../utils/eventBus';
  import FiatValue from './FiatValueComponent.vue';

  export default {
    name: 'RetipComponent',
    props: ['tipid'],
    data() {
      return {
        fiatValue: 0.00,
        value: 0,
        show: false,
        showLoading: false,
        error: true
      }
    },
    components: {
      'fiat-value': FiatValue
    },
    computed: {
      ...mapGetters(['settings']),
    },
    methods:{
      toggleRetip(showRetipForm){
        this.show = showRetipForm;
        if(showRetipForm){
          this.resetForm();
        }
      },
      async retip() {
        let amount = util.aeToAtoms(this.value);
        this.showLoading = true
        await aeternity.contract.methods.retip(this.tipid, {amount: amount})
          .then(response => {
            this.showLoading = false
            this.error = false
          }).catch( error => {
              this.showLoading = false
              this.error = true
          });
        if(!this.error){
          EventBus.$emit('reloadData');
          this.show = false;
        }
      },
      resetForm(){
        this.value = 0;
        this.fiatValue = 0.00;
        this.error = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
 @import "../styles/base";
  .overlay{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
 .retip__icon{
   &:hover{
     cursor: pointer;
   }
 }
 .wrapper{
   display: inline-block;
   z-index: 11;
 }
.wrapper .input-group .input-group-append span.append__ae {
    background: $background_color;
    color: $light_font_color;
}
.input-group{
  border: .065rem solid $custom_links_color;
  border-radius: .25rem;
  width: calc(100% - 4rem);
  .form-control{
    color: $custom_links_color;
    &:focus{
      box-shadow: none;
    }
  }
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
