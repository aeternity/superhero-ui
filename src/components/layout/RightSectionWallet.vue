<template>
  <div
    class="right-section-wallet"
    :class="{ iframe: useIframeWallet }"
  >
    <RightSectionTitle
      v-bind="$attrs"
      :closed="closed"
    >
      <img src="../../assets/iconWallet.svg">
      {{ $t('components.layout.RightSection.Wallet') }}
    </RightSectionTitle>

    <iframe
      v-if="useIframeWallet"
      :class="{ 'half-closed': closed }"
      :src="walletUrl"
    />
    <template v-else-if="isLoggedIn">
      <div class="address">
        {{ address }}
      </div>
      <div class="not-bootstrap-row">
        <AeAmount :amount="balance" />
        <Dropdown
          v-if="currencyDropdownOptions.length"
          :options="currencyDropdownOptions"
          :method="updateCurrency"
          :selected="selectedCurrency"
          rounded
        />
      </div>

      <AeAmount
        v-for="tokenBalance in tokenBalances"
        :key="tokenBalance.token"
        class="not-bootstrap-row"
        :amount="tokenBalance.balance"
        :token="tokenBalance.token"
      />
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import AeAmount from '../AeAmount.vue';
import Dropdown from '../Dropdown.vue';
import RightSectionTitle from './RightSectionTitle.vue';

export default {
  components: { RightSectionTitle, AeAmount, Dropdown },
  props: { closed: Boolean },
  data: () => ({
    walletUrl: process.env.VUE_APP_WALLET_URL,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['balance', 'address', 'useIframeWallet', 'selectedCurrency', 'tokenBalances']),
    ...mapState({
      currencyDropdownOptions({ backend: { prices }, balance }) {
        return Object.entries(prices).map(([currency, price]) => ({
          text: [
            new BigNumber(balance).multipliedBy(price).toFixed(2),
            currency.toUpperCase(),
          ].join(' '),
          value: currency,
        }));
      },
    }),
  },
  methods: mapMutations(['updateCurrency']),
};
</script>

<style lang="scss" scoped>
.right-section-wallet {
  padding: 0.8rem 1rem;
  overflow: hidden;

  &.iframe {
    padding: 0;

    .right-section-title {
      padding: 0.8rem 1rem;
    }
  }

  iframe {
    display: block;
    border: none;
    width: 100%;
    height: 470px;
    transition: height 0.25s;

    &.half-closed {
      height: 150px;
    }
  }

  .address {
    color: $light_font_color;
    font-size: 0.52rem;
    position: relative;
    top: -0.5rem;
  }

  .not-bootstrap-row {
    display: flex;
    align-items: center;

    .ae-amount {
      flex-grow: 1;
      font-size: 1.3rem;
    }
  }
}
</style>
