<template>
  <div class="right-section">
    <SearchInput
      class="section"
      sided
    />

    <div class="section wallet">
      <h2>
        <img src="../../assets/iconWallet.svg">
        {{ $t('components.layout.RightSection.Wallet') }}
      </h2>

      <template v-if="isLoggedIn">
        <div class="account">
          {{ account }}
        </div>
        <div class="not-bootstrap-row">
          <AeAmount :amount="balance" />
          <Dropdown
            v-if="currencyDropdownOptions"
            :options="currencyDropdownOptions"
            :method="updateCurrency"
            :selected="selectedCurrency"
          />
        </div>
      </template>
      <OutlinedButton
        v-else
        :href="addressDeepLink"
        class="fullwidth"
      >
        {{ $t('components.layout.RightSection.LoginWithWallet') }}
      </OutlinedButton>
    </div>

    <div class="section trending">
      <h2>
        <img src="../../assets/iconTrending.svg">
        {{ $t('components.layout.RightSection.Trending') }}
      </h2>

      <div class="topics-list">
        <div
          v-for="[topic, data] in topics"
          :key="topic"
          class="not-bootstrap-row"
        >
          <Topic
            class="text-ellipsis"
            :topic="topic"
          />
          <AeAmountFiat :amount="data.amount" />
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import AeAmount from '../AeAmount.vue';
import AeAmountFiat from '../AeAmountFiat.vue';
import Topic from '../tipRecords/Topic.vue';
import FooterSection from './FooterSection.vue';
import Dropdown from '../Dropdown.vue';
import SearchInput from './SearchInput.vue';
import OutlinedButton from '../OutlinedButton.vue';
import { createDeepLinkUrl } from '../../utils/util';

export default {
  name: 'RightSection',
  components: {
    Topic,
    AeAmount,
    AeAmountFiat,
    FooterSection,
    Dropdown,
    SearchInput,
    OutlinedButton,
  },
  data: () => ({
    addressDeepLink: createDeepLinkUrl({
      type: 'address',
      'x-success': `${window.location}?address={address}`,
    }),
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['balance', 'account']),
    ...mapState({
      topics: ({ topics }) => topics.filter(([t]) => t !== '#test'),
      selectedCurrency: ({ settings }) => settings.currency,
      currencyDropdownOptions({ currencyRates: { aeternity } = {}, balance }) {
        if (!aeternity || !balance) return null;
        return Object.keys(aeternity).map((currency) => ({
          text: [
            new BigNumber(balance).multipliedBy(aeternity[currency]).toFixed(2),
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
.right-section {
  color: $light_font_color;
  font-size: 0.75rem;

  .section {
    background-color: $article_content_color;
    border-radius: 0.5rem;
    padding: 0.8rem 1rem 1rem 1rem;
    margin-bottom: 0.5rem;

    h2 {
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 600;
      padding-bottom: 0.65rem;

      img {
        height: 1.2rem;
        margin-right: 0.2rem;
      }
    }

    .ae-amount .ae {
      color: $secondary_color;
    }

    .not-bootstrap-row {
      display: flex;
      align-items: center;

      > :nth-child(1) {
        flex-grow: 1;
      }
    }

    &.search-input {
      padding: 0;
    }

    &.wallet {
      .account {
        color: $light_font_color;
        font-size: 0.52rem;
        position: relative;
        top: -0.5rem;
      }

      .ae-amount {
        font-size: 1.3rem;
        color: $standard_font_color;
      }
    }

    &.trending .topics-list {
      transition: max-height 0.25s ease-in;
      -ms-overflow-style: none;
      overflow-y: auto;
      scrollbar-width: none;
      max-height: 25rem;

      &::-webkit-scrollbar {
        display: none;
      }

      @media (max-height: 650px) {
        max-height: 10rem;
      }

      .not-bootstrap-row {
        margin: 0.5rem 0;

        .ae-amount-fiat {
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
