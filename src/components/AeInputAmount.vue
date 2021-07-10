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
    <ButtonDropdown
      v-if="tokenTipable && !noDropdown"
      @click="selectToken"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import FiatValue from './FiatValue.vue';
import ButtonDropdown from './ButtonDropdown.vue';

export default {
  components: {
    ButtonDropdown,
    FiatValue,
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
    this.setToken(this.selectTokenOptions.find((t) => t.token === this.token));
  },
  methods: {
    async selectToken() {
      const token = await this.$store.dispatch('modals/open', {
        name: 'token-select',
        reference: this.$el,
        tokens: this.selectTokenOptions,
        inEnd: true,
      });
      if (!token) return;
      this.setToken(token);
    },
    setToken(selected) {
      if (this.noDropdown) return;
      this.selectedToken = selected.token;
      this.selectTokenF(this.selectedToken);
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
}
</style>
