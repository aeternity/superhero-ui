<template>
  <a
    v-if="!isLoggedIn"
    :href="deepLink"
    target="_blank"
    class="tip__content"
    @click.stop
  >
    <img
      :class="{ tip__icon: !userAddress }"
      :src="iconTip"
    >
    <AeAmountFiat
      v-if="!userAddress"
      :amount="amount"
    />
  </a>
  <div
    v-else
    class="tip-url__wrapper"
    :title="title"
  >
    <div
      v-if="!userAddress"
      class="tip__content"
      :class="{ active: show }"
      @click="show = true"
    >
      <img
        class="tip__icon"
        :src="iconTip"
      >
      <AeAmountFiat :amount="amount" />
    </div>
    <img
      v-else
      class="tip__content tip__user"
      :class="{ active: show }"
      :src="iconTip"
      @click="show = true"
    >
    <Modal
      v-if="show"
      @close="resetForm(); show = false"
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
            v-if="isTip"
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
              :disabled="!isDataValid"
              @click="submitAction"
            >
              {{ isTip ? $t('tip') : $t('retip') }}
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
    userAddress: { type: String, default: '' },
    comment: { type: Object, default: null },
  },
  data() {
    return {
      fiatValue: 0.00,
      value: 0,
      show: false,
      showLoading: false,
      error: false,
      message: '',
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['account', 'loading', 'minTipAmount', 'stats']),
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
    isTip() {
      return !!(this.comment || this.userAddress);
    },
    tipUrl() {
      if (this.comment) {
        return `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`;
      }
      if (this.userAddress) {
        return `https://superhero.com/user-profile/${this.userAddress}`;
      }
      return `https://superhero.com/tip/${this.tip.id}`;
    },
    deepLink() {
      if (this.tip) return createDeepLinkUrl({ type: 'retip', id: this.tip.id });
      return createDeepLinkUrl({ type: 'tip', url: this.tipUrl });
    },
    isMessageValid() {
      return this.message.trim().length > 0;
    },
    isDataValid() {
      return (!this.isTip || this.isMessageValid) && this.value > this.minTipAmount;
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

      return this.tip.total_amount;
    },
    title() {
      if (this.userAddress) return this.$t('components.TipInput.tipUser');
      if (this.comment) return this.$t('components.TipInput.tipComment');
      return this.isTipped
        ? this.$t('components.TipInput.totalTipsWithYou')
        : this.$t('components.TipInput.totalTips');
    },
  },
  methods: {
    submitAction() {
      if (this.isDataValid || this.userAddress) {
        this.sendTip();
      }
    },
    async sendTip() {
      this.showLoading = true;
      const amount = util.aeToAtoms(this.value);
      try {
        if (this.tip) await aeternity.retip(this.tip.id, amount);
        else await aeternity.tip(this.tipUrl, this.message, amount)
        if (!this.userAddress) {
          await Backend.cacheInvalidateTips().catch(console.error);
          EventBus.$emit('reloadData');
        }
        this.show = false;
        this.resetForm();
      } catch (error) {
        this.error = true;
        throw error;
      } finally {
        this.showLoading = false;
      }
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
