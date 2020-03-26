<template>
  <a
    v-if="useDeepLinks"
    :href="deepLink"
    target="_blank"
  >
    <img :src="showRetipIcon ? retipIcon : heartIcon">
    <ae-amount :amount="amount" :round="2" class="vertical-align-mid"></ae-amount>
    <fiat-value :amount="amount" class="vertical-align-mid"></fiat-value>
  </a>
  <div v-else class="d-inline-block retip__wrapper">
    <div class="overlay" @click="toggleRetip(false)" v-if="show"></div>
    <div class="position-relative wrapper" @:click.stop>
      <div
        class="retip__content"
        :class="[{ active: show }]"
        @click="toggleRetip(!show)"
      >
        <img
          v-if="!showRetipIcon"
          class="retip__icon"
          :src="heartIcon"
        >
        <img
          v-else
          class="retip__icon"
          :src="retipIcon"
        >
        <ae-amount :amount="amount" :round="2" class="vertical-align-mid"></ae-amount>
        <fiat-value :amount="amount" class="vertical-align-mid"></fiat-value>
      </div>
      <div class="retip__container" v-if="show">
        <loading :show-loading="showLoading"/>
        <div
          class="text-center mb-2"
          v-show="error && !showLoading"
        >
          An error occurred while sending retip
        </div>
        <div v-if="!showLoading">
          <div
            v-if="!showRetipIcon"
            class="input-group"
          >
            <input
              type="text"
              class="form-control"
              v-model="title"
              placeholder="Add message"
            >
          </div>
          <div class="input-group">
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
                <fiat-value :displaySymbol="true" :amount="value"/>
              </span>
            </div>
            <div class="button-section">
              <button
                v-if="!showRetipIcon"
                class="btn btn-primary retip__button"
                :disabled='!isDataValid'
                @click="sendTip()"
              >
                Tip
              </button>
              <button
                v-else
                class="btn btn-primary retip__button"
                :disabled='!isDataValid'
                @click="retip()"
              >
                Retip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import heartIcon from '../assets/heart.svg';
import retipIcon from '../assets/retipIcon.svg';
import aeternity from '../utils/aeternity';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import util, { IS_FRAME, IS_MOBILE_DEVICE } from '../utils/util';
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';
import Loading from './Loading.vue';

export default {
  name: 'Retip',
  props: ['tipid', 'showRetipIcon', 'amount', 'tipurl'],
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
      title: '',
    };
  },
  components: {
    Loading,
    FiatValue,
    AeAmount,
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
    isDataValid() {
      if (this.showRetipIcon) {
        return this.value > 0;
      }
      return this.value > 0 && this.title.length > 0;
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
      await aeternity.retip(this.tipid, amount)
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
    async sendTip() {
      const amount = util.aeToAtoms(this.value);
      this.showLoading = true;
      await aeternity.tip(this.tipurl, this.title, amount)
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
      this.title = '';
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
  .overlay {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 10;
  }

  .retip__icon:hover {
    cursor: pointer;
  }

  .wrapper {
    z-index: 20;
  }

  .currency-value,
  .ae-amount {
    align-items: center;
    display: flex;
    height: 1rem;
  }

  .retip__content {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 1rem;
    position: relative;

    img {
      height: 1rem;
      margin-right: .2rem;
      vertical-align: top;
      width: 1rem;
    }

    &:hover img {
      filter: brightness(1.3);
    }
  }

  .ae-amount {
    color: #fff;
  }

  .ae {
    color: $secondary_color;
  }

  .button-section {
    margin-left: .5rem;
    text-align: center;

    button {
      width: 100%;
    }
  }

  .retip__wrapper {
    height: 1rem;
  }

  .retip__container {
    background-color: black;
    border-radius: .5rem;
    display: flex;
    flex-wrap: wrap;
    margin-top: .25rem;
    min-width: 19rem;
    padding: 1rem;
    position: absolute;

    .form-control {
      color: $custom_links_color;

      &:focus {
        box-shadow: none;
      }

      &[type=number]:focus {
        border-right: none;
      }

      &[type=number]:focus ~ .input-group-append .input-group-text {
        border: .05rem solid $custom_links_color;
        border-left: none;
      }
    }

    .retip__button {
      background-color: $custom_links_color;
      border: 1px solid $custom_links_color;
      color: $standard_font_color;
    }

    .input-group {
      width: 100%;

      &:not(:last-child) {
        margin-bottom: .5rem;
      }

      .append__ae {
        border-bottom-right-radius: .25rem;
        border-top-right-radius: .25rem;

        background: $background_color !important;
        color: $light_font_color;
        cursor: default;
        font-size: 0.75rem;
      }
    }
  }

  @media only screen and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
    .retip__container {
      min-width: 13rem;
      padding: .5rem;
    }

    .retip__button {
      font-size: .5rem;
    }
  }
</style>
