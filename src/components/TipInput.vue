<template>
  <div class="tip-input">
    <Component
      :is="useSdkWallet ? 'button' : 'a'"
      :href="useSdkWallet ? undefined : deepLink"
      class="button"
      :title="title"
      @click="useSdkWallet && (showModal = true)"
    >
      <img :src="iconTip">
      <template v-if="!userAddress">
        &nbsp;<AeAmountFiat :amount="tipUrlStats.amount" />
      </template>
    </Component>
    <Modal
      v-if="showModal"
      @close="hideModal"
    >
      <Loading v-if="showLoading" />
      <template v-else>
        <div
          v-if="error"
          class="error"
        >
          {{ $t('components.TipInput.error') }}
        </div>
        <form @submit.prevent="sendTip">
          <div class="input-group"><!-- TODO: Remove this wrapper after removing bootstrap -->
            <input
              v-if="!tip"
              v-model="message"
              maxlength="280"
              class="message form-control"
              :placeholder="$t('addMessage')"
            >
          </div>
          <div class="not-bootstrap-row">
            <AeInputAmount v-model="value" />
            <AeButton :disabled="!isValid">
              {{ tip ? $t('retip') : $t('tip') }}
            </AeButton>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import iconTip from '../assets/iconTip.svg';
import iconTipUser from '../assets/iconTipUser.svg';
import iconTipped from '../assets/iconTipped.svg';
import { tip, retip } from '../utils/aeternity';
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
  data: () => ({
    value: 0,
    showModal: false,
    showLoading: false,
    error: false,
    message: '',
  }),
  computed: {
    ...mapState(['useSdkWallet', 'account']),
    ...mapGetters('backend', ['minTipAmount']),
    ...mapState('backend', {
      tipUrlStats({ stats }) {
        const urlStats = stats && stats.by_url.find(({ url }) => url === this.tipUrl);
        if (!urlStats) return {};
        return {
          isTipped: urlStats.senders.includes(this.account),
          amount: urlStats.total_amount,
        };
      },
    }),
    tipUrl() {
      if (this.comment) {
        return `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`;
      }
      if (this.userAddress) {
        return `https://superhero.com/user-profile/${this.userAddress}`;
      }
      return this.tip.url;
    },
    deepLink() {
      return createDeepLinkUrl(this.tip
        ? { type: 'retip', id: this.tip.id } : { type: 'tip', url: this.tipUrl });
    },
    isValid() {
      return (this.tip || this.message.trim().length > 0) && this.value > this.minTipAmount;
    },
    iconTip() {
      if (this.userAddress) return iconTipUser;
      return this.tipUrlStats.isTipped ? iconTipped : iconTip;
    },
    title() {
      if (this.userAddress) return this.$t('components.TipInput.tipUser');
      if (this.comment) return this.$t('components.TipInput.tipComment');
      return this.tipUrlStats.isTipped
        ? this.$t('components.TipInput.totalTipsWithYou')
        : this.$t('components.TipInput.totalTips');
    },
  },
  methods: {
    async sendTip() {
      if (!this.isValid) return;
      this.showLoading = true;
      try {
        const amount = util.aeToAtoms(this.value);
        if (this.tip) await retip(this.tip.id, amount);
        else await tip(this.tipUrl, this.message, amount);
        if (!this.userAddress) {
          await Backend.cacheInvalidateTips();
          EventBus.$emit('reloadData');
        }
        this.hideModal();
      } catch (error) {
        this.error = true;
        throw error;
      } finally {
        this.showLoading = false;
      }
    },
    hideModal() {
      this.showModal = false;
      this.message = '';
      this.value = 0;
      this.error = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-input {
  .button {
    border: none;
    background: none;
    outline: none;
    padding: 0;

    &:hover img {
      filter: brightness(1.3);
    }

    img {
      height: 1em;
    }

    .ae-amount-fiat {
      vertical-align: middle;

      ::v-deep {
        .ae-amount {
          font-size: 0.8rem;
        }

        .fiat-value {
          font-size: 0.7rem;
          vertical-align: 0.05rem;
        }
      }
    }
  }

  .not-bootstrap-modal ::v-deep .not-bootstrap-modal-content {
    background-color: $article_content_color;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    min-width: 19rem;
    padding: 1rem;

    @include smallest {
      min-width: 16rem;
      padding: 0.5rem;
    }
  }

  .not-bootstrap-modal .not-bootstrap-modal-content {
    .error {
      text-align: center;
    }

    .message {
      margin-bottom: 0.5rem;
    }

    .not-bootstrap-row {
      display: flex;

      .ae-button {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
