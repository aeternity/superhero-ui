<template>
  <ClientOnly>
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
        <div class="row">
          <ButtonDropdown
            v-if="hasContractV2Address"
            ref="tokensOpener"
            @click="selectToken"
          >
            <AeAmount
              :amount="(selectedToken || aeternityTokenData).balance"
              :token="(selectedToken || aeternityTokenData).token"
            />
          </ButtonDropdown>
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
  </ClientOnly>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import ClientOnly from 'vue-client-only';
import AeAmount from '../AeAmount.vue';
import Dropdown from '../Dropdown.vue';
import RightSectionTitle from './RightSectionTitle.vue';
import OutlinedButton from '../OutlinedButton.vue';
import FiatValue from '../FiatValue.vue';
import ButtonDropdown from '../ButtonDropdown.vue';

export default {
  components: {
    ClientOnly,
    ButtonDropdown,
    FiatValue,
    RightSectionTitle,
    AeAmount,
    Dropdown,
    OutlinedButton,
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
            this.setToken(option);
          }
        } else {
          this.setToken(null);
        }
      },
    },
  },
  methods: {
    ...mapMutations(['updateCurrency']),
    ...mapMutations('aeternity', ['enableIframeWallet']),
    async selectToken() {
      const token = await this.$store.dispatch('modals/open', {
        name: 'token-select',
        reference: this.$refs.tokensOpener.$el,
        tokens: this.tokenBalancesOptions,
      });
      if (!token) return;
      this.setToken(token === this.aeternityTokenData ? null : token);
    },
    setToken(option) {
      this.selectedToken = option;
      this.showCurrencyDropdown = option === null
        || (!!this.tokenPrices[option?.token] && !!this.tokenInfo[option?.token]);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-section-wallet {
  padding: 8px 16px;

  &.iframe {
    padding: 0;

    .right-section-title {
      padding: 8px 16px;
    }
  }

  iframe {
    display: block;
    border: none;
    width: 100%;
    height: 600px;
    transition: height 0.25s;

    &.half-closed {
      height: 245px;
    }
  }

  .address {
    color: $light_font_color;
    font-size: 0.52rem;
    position: relative;
    top: -0.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ae-amount,
    .button-dropdown {
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
