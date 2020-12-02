<template>
  <div class="input-group">
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
    >
    <div
      class="input-group-append"
    >
      <span
        class="input-group-text append__ae text-ellipsis"
        :title="value"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
        <span
          class="symbol"
        >
          {{ tokenTipable && selectedToken !== 'native' ? tokenInfo[selectedToken].symbol : 'AE' }}
        </span>
        <!-- eslint-enable vue-i18n/no-raw-text -->
        <FiatValue
          :amount="!tokenTipable || selectedToken === 'native' ? value.toString() : '0'"
        />
      </span>
      <Dropdown
        v-if="tokenTipable"
        :options="selectTokenOptions"
        :selected="selectedToken"
        :method="selectToken"
        show-right
      >
        <template v-slot="{ option }">
          <div class="token-option">
            <TokenAvatarAndSymbol :address="option.token" />
            <AeAmount
              :amount="option.balance"
              :token="option.token"
              without-symbol
              class="tokens-amount"
            />
            &nbsp;
            <FiatValue
              :amount="option.token === 'native' ? option.balance.toString() : '0'"
            />
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FiatValue from './FiatValue.vue';
import Dropdown from './Dropdown.vue';
import AeAmount from './AeAmount.vue';
import TokenAvatarAndSymbol from './fungibleTokens/TokenAvatarAndSymbol.vue';

export default {
  components: {
    Dropdown, FiatValue, TokenAvatarAndSymbol, AeAmount,
  },
  props: {
    min: { type: Number, default: 0 },
    step: { type: Number, default: 0.01 },
    value: { type: [Number, String], required: true },
    selectTokenF: { type: Function, required: true },
    disabled: { type: Boolean },
    notTokenTipable: { type: Boolean },
  },
  data: () => ({
    selectedToken: 'native',
  }),
  computed: {
    ...mapState(['tokenInfo']),
    ...mapState({
      selectTokenOptions: ({ tokenBalances, balance }) => [
        { token: 'native', balance },
        ...tokenBalances,
      ],
    }),
    tokenTipable() {
      return !this.notTokenTipable && !!process.env.VUE_APP_CONTRACT_V2_ADDRESS;
    },
  },
  methods: {
    selectToken(selected) {
      this.selectedToken = selected.token;
      this.selectTokenF(this.selectedToken);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-group {
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

  &:focus-within {
    border: 0.05rem solid $secondary_color;
  }

  input,
  input ~ .input-group-append > span.append__ae {
    border: 0;

    &:focus {
      border: 0;
    }
  }

  .input-group-append > span.append__ae {
    font-size: 0.75rem;
    background: $buttons_background;
    cursor: default;

    .symbol {
      color: $secondary_color;
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
  }

  .dropdown::v-deep {
    border-radius: 50%;

    > button {
      background-color: transparent;
      height: 2.1rem;
      margin-left: -.8rem;;
    }

    .not-bootstrap-modal-content {
      margin-top: 0.25rem;
    }
  }
}
</style>
