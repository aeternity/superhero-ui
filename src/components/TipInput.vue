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
      <AeAmountFiat
        v-if="!userAddress && !isTokenAndZeroAeTip"
        :amount="tip ? tipUrlStats.amount_ae || tip.total_amount_ae : '0'"
        class="amount"
      />
      <AeAmountFiat
        v-for="tokenTip in tipUrlStats.token_total_amount || tip.token_total_amount"
        :key="tokenTip.token"
        :amount="tokenTip.amount"
        :token="tokenTip.token"
        class="amount"
      />
    </Component>
    <Modal
      v-if="showModal && tip.url"
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
        <form
          class="d-flex flex-row"
          @submit.prevent="sendTip"
        >
          <input
            v-if="!tip"
            v-model="message"
            maxlength="280"
            class="message form-control"
            :placeholder="$t('addMessage')"
          >
          <AeInputAmount
            v-model="inputValue"
            :not-token-tipable="!isTokenTipable"
            :select-token-f="(token) => inputToken = token"
          />
          <AeButton
            :disabled="!isValid"
            class="ml-2"
          >
            {{ tip ? $t('retip') : $t('tip') }}
          </AeButton>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  retip, tip, tipToken, retipToken,
} from '@/utils/aeternity';
import { EventBus } from '@/utils/eventBus';
import BigNumber from 'bignumber.js';
import iconTip from '../assets/iconTip.svg';
import iconTipUser from '../assets/iconTipUser.svg';
import iconTipped from '../assets/iconTipped.svg';
import Backend from '../utils/backend';
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
    inputValue: 0,
    inputToken: 'native',
    showModal: false,
    showLoading: false,
    error: false,
    message: '',
  }),
  computed: {
    ...mapState(['useSdkWallet', 'account', 'minTipAmount', 'tokenInfo']),
    ...mapState('backend', {
      tipUrlStats({ stats }) {
        const urlStats = stats && stats.by_url.find(({ url }) => url === this.tipUrl);
        if (!urlStats) return {};
        return {
          isTipped: urlStats.senders.includes(this.account),
          amount_ae: urlStats.total_amount_ae,
          token_total_amount: urlStats.token_total_amount,
        };
      },
    }),
    isTokenAndZeroAeTip() {
      return new BigNumber(this.tipUrlStats.amount_ae || '0').isZero()
        && new BigNumber(this.tip.total_amount_ae).isZero()
        && !!this.tip.token;
    },
    isTokenTipable() {
      return this.tip.id.split('_')[1] === 'v2';
    },
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
      return (this.tip || this.message.trim().length > 0) && this.inputValue > this.minTipAmount;
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
        const isTokenTip = this.inputToken !== 'native';
        const amount = util.shiftDecimalPlaces(this.inputValue,
          isTokenTip ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

        if (this.tipUrl !== this.tip.url) {
          if (isTokenTip) await tipToken(this.tipUrl, this.message, amount, this.inputToken);
          else await tip(this.tipUrl, this.message, amount);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (isTokenTip) await retipToken(this.tip.id, amount, this.inputToken);
          else await retip(this.tip.contractId, this.tip.id, amount);
        }

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
      this.inputValue = 0;
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
      display: inline-flex;
      vertical-align: middle;
      margin-left: 0.2rem;
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
