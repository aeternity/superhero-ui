
<template>
  <a
    v-if="USE_DEEP_LINKS"
    :href="deepLink"
    target="_blank"
    class="retip__content"
  >
    <img :src="iconTip">
    <ae-amount
      :amount="tip.total_amount"
      :round="2"
      class="vertical-align-mid"
    />
    <fiat-value
      :amount="tip.total_amount"
      class="vertical-align-mid"
    />
  </a>
  <div
    v-else
    class="retip__wrapper"
    :title="isTipped ? 'Total tips (you tipped too)' : 'Total tips (click to retip the same URL)'"
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
          :amount="tip.total_amount"
          :round="2"
        />
        <fiat-value :amount="tip.total_amount" />
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
import { mapGetters } from 'vuex';
import iconTip from '../assets/iconTip.svg';
import iconTipped from '../assets/iconTipped.svg';
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
    tip: { type: Object, required: true },
  },
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: true,
      USE_DEEP_LINKS,
    };
  },
  computed: {
    ...mapGetters(['account', 'balance', 'isLoggedIn', 'loading']),
    eventPayload() {
      return `${this.tip.id}:${this.show}`;
    },
    deepLink() {
      const url = new URL(`${process.env.VUE_APP_WALLET_URL}/retip`);
      url.searchParams.set('id', this.tip.id);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
    isDataValid() {
      return this.value > 0;
    },
    isTipped() {
      return !this.loading
        || (this.tip.sender === this.account)
        || this.tip.retips.filter((retip) => retip.sender === this.account).length > 0;
    },
    iconTip() {
      return this.isTipped ? iconTipped : iconTip;
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
      this.showLoading = true;
      await aeternity.retip(this.tip.id, util.aeToAtoms(this.value))
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
      height: 0.7rem;
      margin-right: 0.2rem;
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
    margin-left: 0.5rem;
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
    border-radius: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.25rem;
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
        border: 0.05rem solid $custom_links_color;
        border-left: none;
      }
    }

    .ae-button {
      margin-left: 0.5rem;
    }

    .input-group {
      width: 100%;

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }

      .append__ae {
        border-bottom-right-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
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
      padding: 0.5rem;
    }

    .retip__button {
      font-size: 0.5rem;
    }
  }
</style>
