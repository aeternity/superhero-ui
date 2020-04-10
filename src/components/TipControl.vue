
<template>
  <a
    v-if="USE_DEEP_LINKS"
    :href="deepLink"
    target="_blank"
    class="tip__content"
  >
    <img :src="iconTip">
    <ae-amount
      :amount="tip.retip_amount_ae.toString()"
      :round="2"
      class="vertical-align-mid"
    />
    <fiat-value
      :amount="tip.retip_amount_ae.toString()"
      class="vertical-align-mid"
    />
  </a>
  <div
    v-else
    class="tip-url__wrapper"
    title="Total amount of retips"
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
        class="retip__content"
        :class="[{ active: show }]"
        @click="toggleTip(!show)"
      >
        <img
          class="tip__icon"
          :src="iconTip"
        >
        <ae-amount
          :amount="tip.retip_amount_ae"
          :round="2"
        />
        <fiat-value :amount="tip.retip_amount_ae.toString()" />
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
        <div
          v-if="!showLoading"
          class="input-group"
        >
          <input
            v-model="message"
            type="text"
            class="form-control tip__message"
            placeholder="Add message"
          >
        </div>
        <div v-if="!showLoading">
          <ae-input-amount v-model="value" />
          <ae-button
            :disabled="!(isSendTipDataValid || isSendMessageDataValid)"
            @click="submitAction()"
          >
            Tip
          </ae-button>
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
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import { wallet } from '../utils/walletSearch';

export default {
  name: 'TipControl',
  components: {
    Loading,
    FiatValue,
    AeInputAmount,
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
      message: '',
    };
  },
  computed: {
    ...mapGetters(['account', 'balance', 'isLoggedIn', 'loading']),
    eventPayload() {
      return `${this.tip.id}:${this.show}`;
    },
    deepLink() {
      const url = new URL(`${process.env.VUE_APP_WALLET_URL}/tip`);
      url.searchParams.set('id', this.tip.id);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
    isSendMessageDataValid() {
      return this.message.trim().length > 0 && !this.value;
    },
    isSendTipDataValid() {
      return this.value > 0 && this.message.trim().length > 0;
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
    EventBus.$on('showTipForm', (payload) => {
      if (payload !== this.eventPayload) {
        this.show = false;
      }
    });
  },
  methods: {
    submitAction() {
      if (this.isSendMessageDataValid) {
        this.sendTipComment();
      } else if (this.isSendTipDataValid) {
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
      const amount = util.aeToAtoms(this.value);
      this.showLoading = true;
      await aeternity.tip(`${window.location.origin}/#/tip/${this.tip.id}`, this.message, amount)
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
.tip__message {
  margin-bottom: 0.5rem;
}
</style>
