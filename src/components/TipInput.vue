<template>
  <a
    v-if="!isLoggedIn"
    :href="deepLink"
    target="_blank"
    class="tip__content"
    @click.stop
  >
    <img
      :class="!userAddress ? 'tip__icon' : 'tip__icon_user'"
      :src="iconTip"
    >
    <AeAmountFiat
      v-if="!userAddress"
      :amount="amount"
    />
    <span
      v-else
      class="tip-user-text"
    >
      {{ $t('tip') }}
    </span>
  </a>
  <div
    v-else
    class="tip-url__wrapper"
    :title="title"
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
      class="tip__content tip__user"
      :class="[{ active: show }]"
      @click="toggleTip(!show)"
    >
      <img
        class="tip__icon_user"
        :src="iconTip"
      >
      <span class="tip-user-text">{{ $t('tip') }}</span>
    </div>
    <Modal
      v-if="show"
      @close="toggleTip(false)"
    >
      <div class="tip__container">
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
              maxlength="280"
              type="text"
              class="form-control tip__message"
              :placeholder="$t('addMessage')"
            >
          </div>
          <div class="amount__row">
            <AeInputAmount v-model="value" />
            <AeButton
              v-if="userAddress || comment"
              :disabled="!(value > minTipAmount && isMessageValid)"
              @click="submitAction"
            >
              {{ $t('tip') }}
            </AeButton>
            <AeButton
              v-else
              :disabled="!isDataValid"
              @click="submitAction"
            >
              {{ isRetip ? $t('components.TipInput.retip') : $t('tip') }}
            </AeButton>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import iconTip from '../assets/iconTip.svg';
import iconTipUser from '../assets/iconTipUser.svg';
import iconTipped from '../assets/iconTipped.svg';
import * as aeternity from '../utils/aeternity';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import util, { createDeepLinkUrl } from '../utils/util';
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import Modal from './Modal.vue';
import i18n from '../utils/i18nHelper';

export default {
  name: 'TipInput',
  components: {
    Loading,
    AeInputAmount,
    AeButton,
    AeAmountFiat,
    Modal,
  },
  props: {
    tip: { type: Object, default: null },
    isRetip: { type: Boolean },
    userAddress: { type: String, default: '' },
    comment: { type: Object, default: null },
  },
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: true,
      message: '',
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['account', 'loading', 'minTipAmount', 'stats']),
    eventPayload() {
      if (!this.userAddress) {
        if (this.comment) {
          return `${this.comment.id}:${this.show}`;
        }
        return `${this.tip.id}:${this.show}`;
      }
      return null;
    },
    derivedUserTipStats() {
      if (!this.stats || !this.stats.by_url) {
        return null;
      }
      return this.stats.by_url.find((tipStats) => tipStats.url === `https://superhero.com/user-profile/${this.userAddress}`);
    },
    derivedCommentTipStats() {
      if (!this.stats || !this.stats.by_url) {
        return null;
      }
      return this.stats.by_url.find((tipStats) => tipStats.url === `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`);
    },
    deepLink() {
      let url = '';
      if (this.comment) {
        url = createDeepLinkUrl({ type: 'tip' });
        url.searchParams.set('url', `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`);
      } else if (this.userAddress) {
        url = createDeepLinkUrl({ type: 'tip' });
        url.searchParams.set('url', `https://superhero.com/user-profile/${this.userAddress}`);
      } else if (this.isRetip) {
        url = createDeepLinkUrl({ type: 'retip', id: this.tip.id });
      } else {
        url = createDeepLinkUrl({ type: 'tip' });
        url.searchParams.set('url', `https://superhero.com/tip/${this.tip.id}`);
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
    isTipped() {
      if (this.userAddress) {
        if (!this.stats || !this.derivedUserTipStats) {
          return false;
        }
        return this.derivedUserTipStats.senders.find((sender) => sender === this.account) !== null;
      }

      if (this.comment) {
        if (!this.stats || !this.derivedCommentTipStats) {
          return false;
        }
        return this.derivedCommentTipStats.senders
          .find((sender) => sender === this.account) !== null;
      }

      return !this.loading
          || (this.tip.sender === this.account)
          || this.tip.retips.filter((retip) => retip.sender === this.account).length > 0;
    },
    iconTip() {
      if (this.userAddress) {
        return iconTipUser;
      }
      return this.isTipped ? iconTipped : iconTip;
    },
    amount() {
      if (this.comment) {
        if (!this.stats || !this.derivedCommentTipStats) {
          return '0';
        }
        return this.derivedCommentTipStats.total_amount;
      }

      return this.isRetip
        ? this.tip.total_amount
        : this.tip.retip_amount_ae;
    },
    title() {
      if (this.userAddress) {
        return i18n.t('components.TipInput.tipUser');
      }

      if (this.comment) {
        return i18n.t('components.TipInput.tipComment');
      }

      if (this.isRetip) {
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
      if (!this.isRetip && this.isMessageValid && !this.value) {
        this.sendTipComment();
        return;
      }

      if (this.isDataValid || this.userAddress) {
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
    async sendTip() {
      this.showLoading = true;
      const amount = util.aeToAtoms(this.value);
      let url = '';
      if (this.comment) {
        url = `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`;
      } else if (this.userAddress) {
        url = `https://superhero.com/user-profile/${this.userAddress}`;
      } else {
        url = `https://superhero.com/tip/${this.tip.id}`;
      }
      (this.isRetip
        ? aeternity.retip(this.tip.id, amount)
        : aeternity.tip(url, this.message, amount))
        .then(async () => {
          if (!this.userAddress) {
            await Backend.cacheInvalidateTips().catch(console.error);
            EventBus.$emit('reloadData');
          }
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
      if (!this.$store.state.useSdkWallet) {
        window.location = createDeepLinkUrl(
          { type: 'comment', id: this.tip.id, text: this.message },
        );
        return;
      }
      this.showLoading = true;
      await Backend.sendTipComment(
        this.tip.id,
        this.message,
        aeternity.client.rpcClient.getCurrentAccount(),
        (data) => aeternity.client.signMessage(data),
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
    position: relative;
    display: flex;
    align-items: center;
    line-height: 1;

    .tip__icon {
      margin: 0.1rem 0.3rem 0.05rem 0;
      height: 0.7rem;
      flex: 0 0 0.875rem;
      width: 0.875rem;
    }

    &:hover .tip__icon {
      filter: brightness(1.3);
    }
  }

  .tip-url__wrapper {
    height: 1rem;

    .tip__container {
      background-color: $article_content_color;
      border-radius: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.25rem;
      min-width: 19rem;
      width: fit-content;
      padding: 1rem;

      .ae-button {
        margin-left: 0.5rem;
      }
    }

    .tip__content.user ~ .tip__container {
      right: 0;
    }

    .tip__user {
      cursor: pointer;
    }

    .tip-user-text {
      color: $standard_font_color;
    }
  }

  @include smallest {
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
