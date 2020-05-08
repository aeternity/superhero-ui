<template>
  <a
    v-if="USE_DEEP_LINKS"
    :href="deepLink"
    target="_blank"
    class="tip__content"
    @click.stop
  >
    <img :src="iconTip">
    <AeAmountFiat
      v-if="!userAddress"
      :amount="amount"
    />
    <span
      v-else
      class="tip-user-text"
    >
      Tip
    </span>
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
        v-if="!userAddress"
        class="tip__content"
        :class="[{ active: show }]"
        @click="toggleTip(!show)"
      >
        <img
          class="tip__icon"
          :src="iconTip"
        >
        <AeAmountFiat :amount="amount" />
      </div>
      <div
        v-else
        class="tip__content user"
        :class="[{ active: show }]"
        @click="toggleTip(!show)"
      >
        <img
          class="tip__icon"
          :src="iconTip"
        >
        <span class="tip-user-text">Tip</span>
      </div>
      <div
        v-if="show"
        class="tip__container"
      >
        <Loading v-if="showLoading" />
        <div
          v-show="error && !showLoading"
          class="text-center mb-2"
        >
          {{ $t('components.TipInput.error') }}
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
              :placeholder="$t('addMessage')"
            >
          </div>
          <div class="amount__row">
            <AeInputAmount v-model="value" />
            <AeButton
              v-if="!userAddress"
              :disabled="!isDataValid"
              @click="submitAction"
            >
              {{ isRetip ? $t('components.TipInput.retip') : $t('tip') }}
            </AeButton>
            <AeButton
              v-else
              :disabled="!isUserDataValid"
              @click="submitAction"
            >
              {{ $t('tip') }}
            </AeButton>
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
import util, { USE_DEEP_LINKS, createDeepLinkUrl } from '../utils/util';
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import { wallet } from '../utils/walletSearch';
import { i18n } from '../utils/i18nHelper';

export default {
  name: 'TipInput',
  components: {
    Loading,
    AeInputAmount,
    AeButton,
    AeAmountFiat,
  },
  props: {
    tip: { type: Object, default: null },
    isRetip: { type: Boolean },
    userAddress: { type: String, default: '' },
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
    ...mapGetters(['account', 'loading', 'minTipAmount', 'stats']),
    eventPayload() {
      if (!this.userAddress) {
        return `${this.tip.id}:${this.show}`;
      }
      return null;
    },
    derivedUserTipStats() {
      if (!this.stats || !this.stats.by_url) {
        return null;
      }
      return this.stats.by_url.find((tipStats) => tipStats.url === `https://superhero.com/#/user-profile/${this.userAddress}`);
    },
    deepLink() {
      let url = '';
      if (this.userAddress) {
        url = createDeepLinkUrl({ type: 'tip' });
        url.searchParams.set('url',
          encodeURIComponent(`https://superhero.com/#/user-profile/${this.userAddress}`));
      } else if (this.isRetip) {
        url = createDeepLinkUrl({ type: 'retip', id: this.tip.id });
      } else {
        url = createDeepLinkUrl({ type: 'tip' });
        url.searchParams.set('url',
          encodeURIComponent(`https://superhero.com/#/tip/${this.tip.id}`));
      }
      return url;
    },
    isMessageValid() {
      return this.message.trim().length > 0;
    },
    isDataValid() {
      return ((this.value > this.minTipAmount) && (this.isRetip || this.isMessageValid))
              || (this.isMessageValid && !this.value);
    },
    isUserDataValid() {
      return this.value > this.minTipAmount && this.isMessageValid;
    },
    isTipped() {
      if (this.userAddress) {
        if (!this.stats || !this.derivedUserTipStats) {
          return false;
        }
        return this.derivedUserTipStats.senders.find((sender) => sender === this.account) !== null;
      }
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
      if (this.userAddress) {
        return i18n.t('components.TipInput.tipUser');
      } if (this.isRetip) {
        return this.isTipped
          ? i18n.t('components.TipInput.totalTipsWithYou')
          : i18n.t('components.TipInput.totalTips');
      }
      return i18n.t('components.TipInput.totalRetips');
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
      if (this.userAddress) {
        this.tipUser();
        return;
      }

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
        if (!this.userAddress) {
          EventBus.$emit('showTipForm', this.eventPayload);
        }
        this.resetForm();
      }
    },
    tipUser() {
      this.showLoading = true;
      const amount = util.aeToAtoms(this.value);
      aeternity.tip(`https://superhero.com/#/user-profile/${this.userAddress}`, this.message, amount)
        .then(() => {
          this.showLoading = false;
          this.error = false;
          this.show = false;
          this.resetForm();
        }).catch((e) => {
          console.error(e);
          this.showLoading = false;
          this.error = true;
        });
    },
    async sendTip() {
      this.showLoading = true;
      const amount = util.aeToAtoms(this.value);
      (this.isRetip
        ? aeternity.retip(this.tip.id, amount)
        : aeternity.tip(`https://superhero.com/#/tip/${this.tip.id}`, this.message, amount))
        .then(async () => {
          await Backend.cacheInvalidateTips().catch(console.error);
          EventBus.$emit('reloadData');
          this.showLoading = false;
          this.error = false;
          this.show = false;
          this.resetForm();
        }).catch((e) => {
          console.error(e);
          this.showLoading = false;
          this.error = true;
        });
    },
    async sendTipComment() {
      if (USE_DEEP_LINKS) {
        window.location = createDeepLinkUrl(
          { type: 'comment', id: this.tip.id, text: this.message },
        );
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
    position: relative;

    img {
      height: 0.7rem;
      margin-right: 0.3rem;
      margin-bottom: 0.1rem;
      width: 1rem;
      flex: 0;
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

    .tip__content.user ~ .tip__container {
      right: 0;
    }

    .tip__content.user {
      .tip__icon {
        margin-top: 0.2rem;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .tip-user-text {
      color: $standard_font_color;
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
