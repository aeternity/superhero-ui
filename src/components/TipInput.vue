<template>
  <div class="tip-input">
    <Component
      :is="useSdkWallet ? 'button' : 'a'"
      :href="useSdkWallet ? undefined : deepLink"
      class="button"
      :class="{ tipped: tipUrlStats.isTipped }"
      :title="title"
      :disabled="!tipUrl || tip.type === 'POST_VIA_BURN'"
      @click="useSdkWallet && (showModal = true)"
    >
      <IconTip />
      <AeAmountFiat
        v-if="!userAddress && tipAmount.value"
        :amount="tipAmount.value"
        :token="tipAmount.token"
      />
    </Component>
    <Dropdown
      v-if="showTokenDropdown"
      v-slot="{ option }"
      :options="tipUrlStats.tokenTotalAmount"
      show-right
    >
      <AeAmountFiat
        :key="option.token"
        :amount="option.amount"
        :token="option.token"
      />
    </Dropdown>
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
        <div
          v-if="v1TipWarning"
          class="error"
        >
          {{ $t('components.TipInput.v1TipWarning') }}
        </div>
        <form @submit.prevent="sendTip">
          <div class="input-group">
            <!-- TODO: Remove this wrapper after removing bootstrap -->
            <input
              v-if="!isRetippable"
              v-model="message"
              maxlength="280"
              class="message form-control"
              :placeholder="$t('addMessage')"
            >
          </div>
          <div class="not-bootstrap-row">
            <AeInputAmount
              v-model="inputValue"
              :select-token-f="token => (inputToken = token)"
            />
            <AeButton :disabled="!isValid || v1TipWarning">
              {{ isRetippable ? $t('retip') : $t('tip') }}
            </AeButton>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import IconTip from '../assets/iconTip.svg?icon-component';
import { EventBus } from '../utils/eventBus';
import { createDeepLinkUrl, shiftDecimalPlaces } from '../utils';
import AeInputAmount from './AeInputAmount.vue';
import Loading from './Loading.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import Dropdown from './Dropdown.vue';
import Modal from './Modal.vue';

export default {
  components: {
    Loading,
    AeInputAmount,
    AeButton,
    AeAmountFiat,
    Modal,
    Dropdown,
    IconTip,
  },
  props: {
    tip: { type: Object, default: null },
    userAddress: { type: String, default: '' },
    comment: { type: Object, default: null },
  },
  data: () => ({
    inputValue: 0,
    inputToken: null,
    showModal: false,
    showLoading: false,
    error: false,
    message: '',
  }),
  computed: {
    ...mapState(['address', 'tokenInfo']),
    ...mapState('aeternity', ['useSdkWallet']),
    ...mapGetters('backend', ['minTipAmount']),
    ...mapState('backend', {
      tipUrlStats({ stats }) {
        const urlStats = stats && this.tipUrl
          && stats.urlStats.find(({ url }) => url === this.tipUrl);

        const tipTokenAmount = this.tip?.token
          ? [{ token: this.tip.token, amount: this.tip.tokenAmount }] : [];

        return {
          isTipped: urlStats ? urlStats.senders.includes(this.address) : false,
          totalAmount: urlStats ? urlStats.totalAmount : this.tip?.amount || '0',
          tokenTotalAmount: urlStats ? urlStats.totalTokenAmount : tipTokenAmount,
        };
      },
    }),
    showTokenDropdown() {
      return !this.userAddress
        && this.tipUrlStats
        && this.tipUrlStats.tokenTotalAmount.length > (this.tipAmount.token ? 1 : 0);
    },
    largestFtTipAmount() {
      return this.tipUrlStats.tokenTotalAmount.length
        ? this.tipUrlStats.tokenTotalAmount.reduce(
          (a, b) => (a.amount > b.amount ? a : b),
          this.tipUrlStats.tokenTotalAmount[0],
        )
        : null;
    },
    tipAmount() {
      return this.tipUrlStats.totalAmount !== '0' || this.largestFtTipAmount === null
        ? {
          value: this.tipUrlStats.totalAmount,
          token: null,
        }
        : {
          value: this.largestFtTipAmount?.amount,
          token: this.largestFtTipAmount?.token,
        };
    },
    v1TipWarning() {
      return (
        this.tip
        && this.tip.id.split('_')[1] === 'v1'
        && this.inputToken !== null
      );
    },
    isRetippable() {
      return this.tip && this.tip.type !== 'POST_WITHOUT_TIP';
    },
    tipUrl() {
      if (this.comment) {
        return `https://superhero.com/tip/${this.comment.tipId}/comment/${this.comment.id}`;
      }
      if (this.userAddress) {
        const { href } = this.$router.resolve({
          name: 'user-profile',
          params: { address: this.userAddress },
        });
        return `https://superhero.com${href}`;
      }
      return this.tip.url;
    },
    deepLink() {
      return createDeepLinkUrl(
        this.tip
          ? { type: 'retip', id: this.tip.id }
          : { type: 'tip', url: this.tipUrl },
      );
    },
    isValid() {
      return (
        (this.tip || this.message.trim().length > 0)
        && (this.inputToken !== null || this.inputValue > this.minTipAmount)
      );
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
        const amount = shiftDecimalPlaces(
          this.inputValue,
          this.inputToken !== null
            ? this.tokenInfo[this.inputToken].decimals
            : 18,
        ).toFixed();

        if (!this.isRetippable) {
          await this.$store.dispatch('aeternity/tip', {
            url: this.tipUrl,
            title: this.message,
            amount,
            tokenAddress: this.inputToken,
          });
        } else {
          await this.$store.dispatch('aeternity/retip', {
            contractAddress: this.tip.contractId,
            id: this.tip.id,
            amount,
            tokenAddress: this.inputToken,
          });
        }

        if (!this.userAddress) {
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
      this.inputToken = null;
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
    color: $search_nav_border_color;

    &:hover {
      color: #fff;
    }

    &.tipped {
      color: $secondary_color;

      &:hover {
        color: #0e52d8;
      }
    }

    .iconTip {
      height: 24px;
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

  .not-bootstrap-modal > ::v-deep .not-bootstrap-modal-content {
    background-color: $article_content_color;
    border-radius: 0.25rem;
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
