
<template>
  <a
    v-if="USE_DEEP_LINKS"
    :href="deepLink"
    target="_blank"
    class="retip__content"
  >
    <img :src="iconTip">
    <ae-amount
      :amount="amount"
      :round="2"
      class="vertical-align-mid"
    />
    <fiat-value
      :amount="amount"
      class="vertical-align-mid"
    />
  </a>
  <div
    v-else
    class="retip__wrapper"
  >
    <div
      v-if="show"
      class="overlay"
      @click="toggleRetip(false)"
    />
    <div
      class="retip__container_wrapper"
      @:click.stop
    >
      <div
        class="retip__content"
        :class="[{ active: show }]"
        @click="toggleRetip(!show)"
      >
        <img
          class="retip__icon retip__icon--retip"
          :src="iconTip"
        >
        <ae-amount
          :amount="amount"
          :round="2"
        />
        <fiat-value :amount="amount" />
      </div>
      <div
        v-if="show"
        class="retip__container"
      >
        <loading :show-loading="showLoading" />
        <div
          v-show="error && !showLoading"
          class="text-center mb-2"
        >
          An error occurred while sending retip
        </div>
        <div v-if="!showLoading">
          <div class="input-group">
            <input
              v-model.number="value"
              type="number"
              min="0"
              step="0.1"
              class="form-control retip__value"
              aria-label="Default"
            >
            <div class="input-group-append">
              <span class="input-group-text append__ae">
                <span class="ae">AE</span>
                <fiat-value
                  :display-symbol="true"
                  :amount="value.toString()"
                />
              </span>
            </div>
            <ae-button
              :disabled="!isDataValid"
              @click="retip()"
            >
              Retip
            </ae-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconTip from '../assets/iconTip.svg';
import aeternity from '../utils/aeternity';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import util, { USE_DEEP_LINKS } from '../utils/util';
import AeAmount from './AeAmount.vue';
import FiatValue from './FiatValue.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';

export default {
  name: 'Retip',
  components: {
    Loading,
    FiatValue,
    AeAmount,
    AeButton,
  },
  props: {
    tipid: { type: Number, required: true },
    amount: { type: String, required: true },
    tipurl: { type: String, default: '' },
  },
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: true,
      USE_DEEP_LINKS,
      iconTip,
    };
  },
  computed: {
    eventPayload() {
      return `${this.tipid}:${this.show}`;
    },
    deepLink() {
      const url = new URL(`${process.env.VUE_APP_WALLET_URL}/retip`);
      url.searchParams.set('id', this.tipid);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
    isDataValid() {
      return this.value > 0;
    },
  },
  created() {
    EventBus.$on('showRetipForm', (payload) => {
      if (payload !== this.eventPayload) {
        this.show = false;
      }
    });
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
          await Backend.cacheInvalidateTips().catch(console.error);
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

  .retip__container_wrapper {
    position: relative;
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
      height: .7rem;
      margin-right: .2rem;
      vertical-align: top;
      width: 1rem;
    }

    &:hover img {
      filter: brightness(1.3);
    }
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

    .ae-button {
      margin-left: .5rem;
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
