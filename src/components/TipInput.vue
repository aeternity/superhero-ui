<template>
  <a
    v-if="USE_DEEP_LINKS"
    :href="deepLink"
    target="_blank"
    class="tip__content"
  >
    <img :src="iconTip">
    <ae-amount-fiat :amount="amount" />
  </a>
  <div
    v-else
    class="tip-url__wrapper"
    :title="title"
  >
    <div
      v-if="show"
      class="overlay"
      @click="toggleTip(false)"
    />
    <div
      class="tip__container_wrapper"
      @:click.stop
    >
      <div
        class="tip__content"
        :class="[{ active: show }]"
        @click="toggleTip(!show)"
      >
        <img
          class="tip__icon"
          :src="iconTip"
        >
        <ae-amount-fiat :amount="amount" />
      </div>
      <div
        v-if="show"
        class="tip__container"
      >
        <loading :show-loading="showLoading" />
        <div
          v-show="error && !showLoading"
          class="text-center mb-2"
        >
          An error occurred while sending tip
        </div>
        <form
          v-if="!showLoading"
          @submit.prevent
        >
          <div
            v-if="!isRetip"
            class="input-group"
          >
            <input
              v-model="message"
              type="text"
              class="form-control tip__message"
              placeholder="Add message"
            >
          </div>
          <div class="amount__row">
            <ae-input-amount v-model="value" />
            <ae-button
              :disabled="!isDataValid"
              @click="submitAction()"
            >
              {{ isRetip ? 'Retip' : 'Tip' }}
            </ae-button>
          </div>
        </form>
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
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import { wallet } from '../utils/walletSearch';

export default {
  name: 'TipInput',
  components: {
    Loading,
    AeInputAmount,
    AeButton,
    AeAmountFiat,
  },
  props: {
    tip: { type: Object, required: true },
    isRetip: { type: Boolean },
  },
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: true,
      USE_DEEP_LINKS,
      message: '',
    };
  },
  computed: {
    ...mapGetters(['account', 'loading']),
    eventPayload() {
      return `${this.tip.id}:${this.show}`;
    },
    deepLink() {
      const url = new URL(`${process.env.VUE_APP_WALLET_URL}/${this.isRetip ? 'retip' : 'tip'}`);
      url.searchParams.set('id', this.tip.id);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
    isMessageValid() {
      return this.message.trim().length > 0;
    },
    isDataValid() {
      return (this.value > 0 && (this.isRetip || this.isMessageValid)) || this.isMessageValid;
    },
    isTipped() {
      return !this.loading
        || (this.tip.sender === this.account)
        || this.tip.retips.filter((retip) => retip.sender === this.account).length > 0;
    },
    iconTip() {
      return this.isTipped ? iconTipped : iconTip;
    },
    amount() {
      return this.isRetip
        ? this.tip.total_amount
        : this.tip.retip_amount_ae;
    },
    title() {
      if (this.isRetip) {
        return this.isTipped
          ? 'Total tips (you tipped too)'
          : 'Total tips (click to retip the same URL)';
      }
      return 'Total amount of retips';
    },
  },
  created() {
    EventBus.$on('showTipForm', (payload) => {
      if (payload !== this.eventPayload) {
        this.show = false;
      }
    });
  },
  methods: {
    submitAction() {
      if (!this.isRetip && this.isMessageValid && !this.value) {
        this.sendTipComment();
        return;
      }

      if (this.isDataValid) {
        this.sendTip();
      }
    },
    toggleTip(showTipForm) {
      this.show = showTipForm;
      if (showTipForm) {
        EventBus.$emit('showTipForm', this.eventPayload);
        this.resetForm();
      }
    },
    async sendTip() {
      this.showLoading = true;
      const amount = util.aeToAtoms(this.value);
      (this.isRetip
        ? aeternity.retip(this.tip.id, amount)
        : aeternity.tip(`${window.location.origin}/#/tip/${this.tip.id}`, this.message, amount))
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
    async sendTipComment() {
      if (USE_DEEP_LINKS) {
        const url = new URL(`${process.env.VUE_APP_WALLET_URL}/comment`);
        url.searchParams.set('id', this.tip.id);
        url.searchParams.set('text', this.message);
        url.searchParams.set('x-success', window.location);
        url.searchParams.set('x-cancel', window.location);
        window.location = url;
        return;
      }
      this.showLoading = true;
      await Backend.sendTipComment(
        this.tip.id,
        this.message,
        wallet.client.rpcClient.getCurrentAccount(),
        (data) => wallet.signMessage(data),
      );
      this.showLoading = false;
      this.resetForm();
    },
    resetForm() {
      this.message = '';
      this.value = 0;
      this.fiatValue = 0.00;
      this.error = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .tip__content {
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

  .tip-url__wrapper {
    height: 1rem;

    .overlay {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 10;
    }

    .tip__container_wrapper {
      position: relative;
    }

    .tip__container {
      background-color: black;
      border-radius: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.25rem;
      min-width: 19rem;
      padding: 1rem;
      position: absolute;
      z-index: 10;

      & > div:not(.spinner__container) {
        display: flex;
      }

      .ae-button {
        margin-left: 0.5rem;
      }
    }
  }

  @media only screen
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2) {
    .tip__container {
      min-width: 13rem;
      padding: 0.5rem;
    }
  }

  .tip__message {
    margin-bottom: 0.5rem;
  }

  .amount__row {
    display: flex;
  }
</style>
