<template>
  <a
    v-if="useDeepLinks"
    :href="deepLink"
    target="_blank"
  >
    <img :src="showRetipIcon ? retipIcon : heartIcon">
  </a>
  <div v-else class="d-inline-block">
    <div class="overlay" @click="toggleRetip(false)" v-if="show"></div>
    <div class="position-relative wrapper" v-on:click.stop>
      <img
        @click="toggleRetip(!show)"
        v-if="!showRetipIcon"
        class="retip__icon"
        :src="heartIcon"
      >
      <img @click="toggleRetip(!show)" v-else class="retip__icon" :src="retipIcon">
      <div class="clearfix retip__container" v-if="show">
        <loading :show-loading="showLoading" />
        <div
          class="text-center mb-2"
          v-show="error && !showLoading"
        >
          An error occured while sending retip
        </div>
        <div v-if="!showLoading">
          <div class="input-group mr-1 float-left">
            <input
              type="number"
              min="0"
              step="0.1"
              v-model.number="value"
              class="form-control"
              aria-label="Default"
            >
            <div class="input-group-append">
              <span class="input-group-text append__ae">
                <span class="ae">AE</span>
                <fiat-value :displaySymbol="true" :amount="value" />
              </span>
            </div>
          </div>
          <button
            class="btn btn-primary retip__button float-right"
            :disabled='!isRetipDataValid'
            @click="retip()"
          >
            Retip
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util, { IS_MOBILE_DEVICE, IS_FRAME } from '../utils/util';
import aeternity from '../utils/aeternity';
import { EventBus } from '../utils/eventBus';
import FiatValue from './FiatValue.vue';
import Loading from './Loading.vue';
import heartIcon from '../assets/heart.svg';
import retipIcon from '../assets/retipIcon.svg';
import Backend from '../utils/backend';

export default {
  name: 'Retip',
  props: ['tipid', 'showRetipIcon'],
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: true,
      useDeepLinks: IS_MOBILE_DEVICE && !IS_FRAME,
      heartIcon,
      retipIcon,
    };
  },
  components: {
    Loading,
    FiatValue,
  },
  computed: {
    eventPayload() {
      return `${this.tipid}:${this.showRetipIcon}`;
    },
    deepLink() {
      const url = new URL('https://mobile.z52da5wt.xyz/retip');
      url.searchParams.set('id', this.tipid);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
    isRetipDataValid() {
      return this.value > 0;
    },
  },
  methods: {
    toggleRetip(showRetipForm) {
      this.show = showRetipForm;
      if (showRetipForm) {
        EventBus.$emit('showRetipForm', this.eventPayload);
        this.resetForm();
      }
    },
    async retip() {
      const amount = util.aeToAtoms(this.value);
      this.showLoading = true;
      await aeternity.contract.methods.retip(this.tipid, { amount })
        .then(async () => {
          await new Backend().cacheInvalidateTips().catch(console.error);
          EventBus.$emit('reloadData');
          this.showLoading = false;
          this.error = false;
          this.show = false;
        }).catch((e) => {
          console.error(e);
          this.showLoading = false;
          this.error = true;
        });
    },
    resetForm() {
      this.value = 0;
      this.fiatValue = 0.00;
      this.error = false;
    },
  },
  created() {
    EventBus.$on('showRetipForm', (payload) => {
      if (payload !== this.eventPayload) {
        this.show = false;
      }
    });
  },
};
</script>


<style lang="scss" scoped>
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
   z-index: 20;
   display: inline-block;
 }
.wrapper .input-group .input-group-append span.append__ae {
    background: $background_color;
    color: $light_font_color;
}
.input-group{
  border-radius: .25rem;
  width: calc(100% - 4rem);
  .form-control{
    color: $custom_links_color;
    &:focus{
      box-shadow: none;
    }
    &[type=number]:focus{
      border-right: none;
    }
    &[type=number]:focus~.input-group-append .input-group-text{
      border: .05rem solid $custom_links_color;
      border-left: none;
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
