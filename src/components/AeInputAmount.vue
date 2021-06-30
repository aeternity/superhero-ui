<template>
  <div
    class="ae-input-amount"
    :class="{ disabled }"
  >
    <input
      :value="value"
      v-bind="$attrs"
      type="number"
      inputmode="decimal"
      :min="min"
      :step="step"
      :placeholder="$t('amount')"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
    >
    <span class="symbol">{{ symbol }}</span>
    &nbsp;<FiatValue
      v-if="!noFiatvalue"
      :amount="value"
      :token="selectedToken"
    />
    <Dropdown
      v-if="tokenTipable && !noDropdown"
      :options="selectTokenOptions"
      :selected="selectedToken"
      :method="selectToken"
      show-right
    >
      <template #default="{ option }">
        <div class="token-option">
          <TokenAvatarAndSymbol :address="option.token" />
          <span class="tokens-amount">{{
            showTokenAmount(option.balance, option.token)
          }}</span>
          &nbsp;<FiatValue
            :amount="option.balance"
            :token="option.token"
            :aettos="!!option.token"
          />
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import FiatValue from './FiatValue.vue';
import Dropdown from './Dropdown.vue';
import TokenAvatarAndSymbol from './fungibleTokens/TokenAvatarAndSymbol.vue';

export default {
  components: {
    Dropdown,
    FiatValue,
    TokenAvatarAndSymbol,
  },
  props: {
    min: { type: Number, default: 0 },
    step: { type: Number, default: 0.01 },
    value: { type: [Number, String], required: true },
    selectTokenF: { type: Function, default: (t) => t },
    token: { type: String, default: null },
    disabled: { type: Boolean },
    notTokenTipable: { type: Boolean },
    noDropdown: { type: Boolean },
    noFiatvalue: { type: Boolean },
  },
  data: () => ({
    selectedToken: null,
  }),
  computed: {
    ...mapGetters(['roundedTokenAmount']),
    ...mapState(['tokenInfo']),
    ...mapState({
      selectTokenOptions: ({ tokenBalances, balance }) => [
        { token: null, balance },
        ...tokenBalances.filter((t) => !new BigNumber(t.balance).isZero()),
      ],
    }),
    tokenTipable() {
      return !this.notTokenTipable && !!process.env.VUE_APP_CONTRACT_V2_ADDRESS;
    },
    symbol() {
      if (this.token) {
        return this.tokenInfo[this.token]
          ? this.tokenInfo[this.token].symbol
          : '';
      }
      return this.selectedToken
        ? this.tokenInfo[this.selectedToken].symbol
        : 'AE';
    },
  },
  mounted() {
    this.selectToken(this.selectTokenOptions.find((t) => t.token === this.token));
  },
  methods: {
    selectToken(selected) {
      if (this.noDropdown) return;
      this.selectedToken = selected.token;
      this.selectTokenF(this.selectedToken);
    },
    showTokenAmount(amount, token) {
      return this.roundedTokenAmount(amount || 0, token);
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-input-amount {
  @include input-like;

  display: flex;
  align-items: center;

  &.disabled {
    opacity: 0.44;
  }

  input {
    width: 100%;
  }

  .symbol,
  .fiat-value {
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  .symbol {
    color: $secondary_color;
  }

  .token-option {
    display: flex;
    align-items: center;
    min-width: 12rem;
    max-width: 15rem;

    > div:first-child {
      flex-grow: 1;
    }

    .tokens-amount {
      color: $tip-note-color;
      flex-shrink: 0;
    }
  }

  .dropdown::v-deep {
    border-radius: 50%;

    > button {
      background-color: transparent;
      height: 2.1rem;
    }

    .not-bootstrap-modal-content {
      margin-top: 0.25rem;
    }
  }
}
</style>
