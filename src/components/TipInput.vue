<template>
  <div class="tip-input">
    <ButtonPlain
      :to="useSdkWallet ? undefined : deepLink"
      :class="{ tipped: tipUrlStats.isTipped }"
      :title="title"
      :disabled="!tipUrl"
      @click="openTipInputPopup"
    >
      <IconTip />
      <AeAmountFiat
        v-if="!userAddress && tipAmount.value"
        :amount="tipAmount.value"
        :token="tipAmount.token"
      />
    </ButtonPlain>
    <ButtonDropdown
      v-if="showTokenDropdown"
      ref="tokensOpener"
      @click="$store.dispatch('modals/open', {
        name: 'token-select',
        reference: $refs.tokensOpener.$el,
        notSelectable: true,
        tokens: tipUrlStats.tokenTotalAmount,
        inEnd: true,
      })"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconTip from '../assets/iconTip.svg?icon-component';
import { EventBus } from '../utils/eventBus';
import { createDeepLinkUrl } from '../utils';
import ButtonPlain from './ButtonPlain.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import ButtonDropdown from './ButtonDropdown.vue';

export default {
  components: {
    ButtonPlain,
    AeAmountFiat,
    ButtonDropdown,
    IconTip,
  },
  props: {
    tip: { type: Object, default: null },
    userAddress: { type: String, default: '' },
    comment: { type: Object, default: null },
  },
  computed: {
    ...mapState(['address']),
    ...mapState('aeternity', ['useSdkWallet']),
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
      return createDeepLinkUrl({
        ...this.tip
          ? { type: 'retip', id: this.tip.id }
          : { type: 'tips', url: this.tipUrl },
        callbackUrl: this.$location,
      });
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
    async openTipInputPopup() {
      if (!this.useSdkWallet) return;
      const isTipSent = await this.$store.dispatch('modals/open', {
        name: 'tip-input-popup',
        reference: this.$el,
        tip: this.tip,
        tipUrl: this.tipUrl,
      });
      if (isTipSent && !this.userAddress) {
        EventBus.$emit('reloadData');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-input {
  .button-plain {
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

  .button-dropdown {
    vertical-align: middle;
  }
}
</style>
