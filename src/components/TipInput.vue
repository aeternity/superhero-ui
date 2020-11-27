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
        <AeAmountFiat
          v-if="!tipUrlStats.tokenTotalAmount.length || +tipUrlStats.totalAmountAe !== 0"
          :amount="tipUrlStats.totalAmountAe"
        />
      </template>
    </Component>
    <CustomDropdown
      v-if="tipUrlStats && tipUrlStats.tokenTotalAmount.length"
      :options="tipUrlStats.tokenTotalAmount"
      show-right
      class="token-tips"
      @click.stop
    >
      <template slot-scope="{ option }">
        <AeAmountFiat
          :key="option.token"
          :amount="option.amount"
          :token="option.token"
        />
      </template>
    </CustomDropdown>
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
          <div class="input-group">
            <!-- TODO: Remove this wrapper after removing bootstrap -->
            <input
              v-if="!tip"
              v-model="message"
              maxlength="280"
              class="message form-control"
              :placeholder="$t('addMessage')"
            >
          </div>
          <div class="not-bootstrap-row">
            <AeInputAmount
              v-model="inputValue"
              :select-token-f="(token) => inputToken = token"
            />
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
import { createDeepLinkUrl, shiftDecimalPlaces } from '../utils';
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import CustomDropdown from './CustomDropdown.vue';
import Modal from './Modal.vue';

export default {
  components: {
    Loading,
    AeInputAmount,
    AeButton,
    AeAmountFiat,
    Modal,
    CustomDropdown,
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
    ...mapState(['useSdkWallet', 'address', 'tokenInfo']),
    ...mapGetters('backend', ['minTipAmount']),
    ...mapState('backend', {
      tipUrlStats({ stats }) {
        const urlStats = stats && stats.by_url.find(({ url }) => url === this.tipUrl);
        return {
          isTipped: urlStats ? urlStats.senders.includes(this.address) : false,
          totalAmountAe: urlStats ? urlStats.total_amount_ae : '0',
          tokenTotalAmount: urlStats ? urlStats.token_total_amount : [],
        };
      },
    }),
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
        const amount = shiftDecimalPlaces(this.inputValue,
          this.inputToken !== 'native' ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

        if (!this.tip) await tip(this.tipUrl, this.message, amount, this.inputToken);
        else await retip(this.tip.contractId, this.tip.id, amount, this.inputToken);

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
      this.inputToken = 'native';
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
      margin-right: 0.2rem;
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

    .not-bootstrap-modal-content {
      padding: 0;
      min-width: 15rem;
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

  .token-tips {
    display: inline-block;
    top: -0.15rem;
    position: relative;

    ::v-deep button {
      padding: 0;
    }

    ::v-deep .not-bootstrap-modal-content {
      min-width: 9rem;
    }
  }
}
</style>
