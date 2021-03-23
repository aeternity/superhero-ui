<template>
  <div
    class="right-section-wallet"
    :class="{ iframe: useIframeWallet }"
  >
    <RightSectionTitle
      v-bind="$attrs"
      :closed="closed"
    >
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
        <Dropdown
          v-if="hasContractV2Address"
          :options="tokenBalancesOptions"
          :method="selectToken"
          :selected="aeternityTokenData.token"
        >
          <template #displayValue>
            <AeAmount
              :amount="(selectedToken || aeternityTokenData).balance"
              :token="(selectedToken || aeternityTokenData).token"
            />
          </template>
          <template #default="{ option }">
            <TokenAvatarAndSymbol :address="option.token" />
          </template>
        </Dropdown>
        <AeAmount
          v-else
          :amount="balance"
        />
        <Dropdown
          v-if="currencyDropdownOptions.length && showCurrencyDropdown"
          :options="currencyDropdownOptions"
          :method="({ currency }) => updateCurrency(currency)"
          :selected="selectedCurrency"
          show-right
        >
          <template #displayValue>
            <span class="currency-value spaced">
              <FiatValue
                :amount="(selectedToken || aeternityTokenData).balance"
                :token="(selectedToken || aeternityTokenData).token"
                no-parentheses
                no-symbol
                :aettos="selectedToken && !!selectedToken.token"
              />
            </span>
            {{ selectedCurrency.toUpperCase() }}
          </template>
          <template #default="{ option }">
            <span class="currency-value">
              <FiatValue
                :amount="(selectedToken || aeternityTokenData).balance"
                :token="(selectedToken || aeternityTokenData).token"
                :currency="option.currency"
                no-parentheses
                no-symbol
                :aettos="(selectedToken || aeternityTokenData).token"
              />
            </span>
            {{ option.currency.toUpperCase() }}
          </template>
        </Dropdown>
      </div>
    </template>
    <OutlinedButton
      v-else
      @click="enableIframeWallet"
    >
      {{ $t('components.layout.FooterSection.LoginWithWallet') }}
    </OutlinedButton>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import AeAmount from '../AeAmount.vue';
import Dropdown from '../Dropdown.vue';
import RightSectionTitle from './RightSectionTitle.vue';
import OutlinedButton from '../OutlinedButton.vue';
import TokenAvatarAndSymbol from '../fungibleTokens/TokenAvatarAndSymbol.vue';
import FiatValue from '../FiatValue.vue';

export default {
  components: {
    FiatValue,
    RightSectionTitle,
    AeAmount,
    Dropdown,
    OutlinedButton,
    TokenAvatarAndSymbol,
  },
  props: { closed: Boolean },
  data: () => ({
    walletUrl: process.env.VUE_APP_WALLET_URL,
    hasContractV2Address: !!process.env.VUE_APP_CONTRACT_V2_ADDRESS,
    showCurrencyDropdown: true,
    selectedToken: null,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState('backend', ['prices']),
    ...mapState(['balance', 'address', 'selectedCurrency', 'tokenBalances',
      'tokenPrices', 'tokenInfo', 'wordRegistry']),
    ...mapState('aeternity', ['useIframeWallet']),
    currencyDropdownOptions() {
      return Object.entries(this.prices).map(([currency]) => ({ currency }));
    },
    aeternityTokenData() {
      return {
        balance: this.balance,
        token: null,
      };
    },
    tokenBalancesOptions() {
      return [
        this.aeternityTokenData,
        ...this.tokenBalances,
      ];
    },
  },
  watch: {
    '$route.params.word': {
      immediate: true,
      handler(word) {
        if (word) {
          const wordAddress = this.wordRegistry.find((w) => w.word === word).tokenAddress;
          const option = this.tokenBalancesOptions.find((t) => t.token === wordAddress);
          if (option) {
            this.selectToken(option);
          }
        } else {
          this.selectToken(this.aeternityTokenData);
        }
      },
    },
  },
  methods: {
    ...mapMutations(['updateCurrency']),
    ...mapMutations('aeternity', ['enableIframeWallet']),
    selectToken(option) {
      this.selectedToken = option;
      this.showCurrencyDropdown = option.token === null
        || (!!this.tokenPrices[option.token] && !!this.tokenInfo[option.token]);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-section-wallet {
  padding: 0.8rem 1rem;

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

    .ae-amount,
    .dropdown:first-child {
      flex-grow: 1;
      font-size: 1rem;
    }
  }

  .currency-value {
    color: $tip_note_color;

    &.spaced {
      margin-right: 0.2rem;
    }
  }
}
</style>
