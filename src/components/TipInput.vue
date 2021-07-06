<template>
  <div class="tip-input">
    <ButtonPlain
      :to="useSdkWallet ? undefined : deepLink"
      :class="{ tipped: tipUrlStats.isTipped }"
      :title="title"
      :disabled="!tipUrl"
      @click="useSdkWallet && (showModal = true)"
    >
      <IconTip />
      <AeAmountFiat
        v-if="!userAddress && tipAmount.value"
        :amount="tipAmount.value"
        :token="tipAmount.token"
      />
    </ButtonPlain>
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
      <div
        v-if="error || v1TipWarning"
        class="error"
      >
        {{ v1TipWarning
          ? $t('components.TipInput.v1TipWarning')
          : $t('components.TipInput.error') }}
      </div>
      <form @submit.prevent="sendTip">
        <Input
          v-if="!isRetippable"
          v-model="message"
          class="message"
          maxlength="280"
          :placeholder="$t('addMessage')"
        />
        <div class="row">
          <AeInputAmount
            v-model="inputValue"
            :select-token-f="token => (inputToken = token)"
          />
          <AeButton
            :disabled="!isValid || v1TipWarning"
            :loading="showLoading"
          >
            {{ isRetippable ? $t('retip') : $t('tip') }}
          </AeButton>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import IconTip from '../assets/iconTip.svg?icon-component';
import { EventBus } from '../utils/eventBus';
import { createDeepLinkUrl, shiftDecimalPlaces } from '../utils';
import ButtonPlain from './ButtonPlain.vue';
import Input from './Input.vue';
import AeInputAmount from './AeInputAmount.vue';
import AeButton from './AeButton.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import Dropdown from './Dropdown.vue';
import Modal from './Modal.vue';

export default {
  components: {
    ButtonPlain,
    Input,
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
      return +this.tipUrlStats.totalAmount !== '0'
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
          : { type: 'tips', url: this.tipUrl },
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
  > .button-plain {
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

    .iconTip,
    .ae-amount-fiat {
      vertical-align: middle;
    }

    .iconTip {
      height: 24px;
    }

    .ae-amount-fiat ::v-deep {
      .ae-amount {
        font-size: 0.8rem;
      }

      .fiat-value {
        font-size: 0.7rem;
        vertical-align: 0.05rem;
      }
    }
  }

  .modal > ::v-deep .modal-content {
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

  .modal .modal-content {
    .error {
      text-align: center;
      font-size: 12px;
      color: $red_color;
    }

    .message {
      display: block;
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .row {
      display: flex;

      .ae-button {
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
