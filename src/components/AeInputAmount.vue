<template>
  <div
    class="ae-input-amount input-group"
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
      class="form-control input-amount"
      aria-label="Default"
      aria-describedby="inputGroup-sizing-mn"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
    >
    <div class="input-group-append">
      <span
        class="input-group-text append-ae"
        :title="value"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
        <span class="symbol">
          {{ symbol }}
        </span>
        <!-- eslint-enable vue-i18n/no-raw-text -->
        <FiatValue
          v-if="!noFiatvalue"
          :amount="value"
          :token="selectedToken"
        />
      </span>
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
            <FiatValue
              :amount="option.balance"
              :token="option.token"
              :aettos="!!option.token"
            />
          </div>
        </template>
      </Dropdown>
    </div>
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
.ae-input-amount.input-group {
  border: 0.05rem solid $buttons_background;
  border-radius: 0.25rem;

  .input-group-append {
    max-width: 65%;
    background: $buttons_background;
    align-items: center;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .input-group-text {
    display: block;
  }

  &.disabled {
    opacity: 0.44;
  }

  input,
  input ~ .input-group-append > span.append-ae {
    border: 0;

    &:focus {
      border: 0;
    }
  }

  .input-group-append > span.append-ae {
    font-size: 0.75rem;
    background: $buttons_background;
    cursor: default;

    .symbol {
      color: $secondary_color;
    }
  }

  &:focus-within {
    border-top: 0.05rem solid $secondary_color;
    border-bottom: 0.05rem solid $secondary_color;

    .input-group-append,
    .input-group-append > span.append-ae {
      background-color: $background_color;
    }
  }

  .token-option {
    display: flex;
    align-items: center;
    min-width: 12rem;
    max-width: 15rem;

    > div:first-child {
      flex-grow: 1;
    }
  }

  .tokens-amount {
    color: $tip-note-color;
    margin-right: 0.1rem;
  }

  .dropdown::v-deep {
    border-radius: 50%;

    > button {
      background-color: transparent;
      height: 2.1rem;
      margin-left: -0.8rem;
    }

    .not-bootstrap-modal-content {
      margin-top: 0.25rem;
    }
  }
}
</style>
