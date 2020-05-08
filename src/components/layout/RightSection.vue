<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div
        class="section wallet-install"
      >
        <div class="section__title">
          <img src="../../assets/iconWallet.svg">
          {{ $t('components.layout.RightSection.Wallet') }}
          <div
            v-if="isLoggedIn"
            class="account"
          >
            {{ account }}
          </div>
        </div>
        <div class="section__body">
          <div v-if="!isLoggedIn">
            <a
              :href="downloadUrl"
              target="_blank"
              class="button w-100"
              :title="['opera','vivaldi','brave','edge-chromium'].includes(browser.name)
                ? $t('components.layout.RightSection.AllowInstallation')
                : $t('components.layout.RightSection.InstallExtension')"
            >
              {{ $t('components.layout.RightSection.InstallWallet') }}
            </a>
          </div>
          <div v-else>
            <div
              class="balance text-ellipsis"
              :title="roundAE + ' AE'"
            >
              <AeAmount
                :amount="balance"
                :round="2"
              />
            </div>
            <div class="choose-fiat">
              <Dropdown
                v-if="currencyDropdownOptions"
                :options="currencyDropdownOptions"
                :method="selectCurrency"
                :selected="settings.currency"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="section trending">
        <div class="section__title">
          <img src="../../assets/iconTrending.svg">
          {{ $t('components.layout.RightSection.Trending') }}
        </div>
        <div
          v-if="!loading.tips"
          class="section__body topics-section"
          :class="{ active: topics.length > 0 }"
        >
          <div
            v-for="([topic, data], idx) in topics"
            :key="idx"
            class="section__item"
          >
            <div class="topic-container text-ellipsis">
              <Topic :topic="topic" />
            </div>
            <AeAmountFiat :amount="data.amount" />
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { detect } from 'detect-browser';
import BigNumber from 'bignumber.js';
import AeAmount from '../AeAmount.vue';
import AeAmountFiat from '../AeAmountFiat.vue';
import Topic from '../tipRecords/Topic.vue';
import FooterSection from './FooterSection.vue';
import Dropdown from '../Dropdown.vue';

export default {
  name: 'RightSection',
  components: {
    Topic,
    AeAmount,
    AeAmountFiat,
    FooterSection,
    Dropdown,
  },
  data() {
    return {
      browser: detect(),
    };
  },
  computed: {
    ...mapGetters(['topics', 'loading', 'isLoggedIn', 'balance', 'account', 'currencyRates', 'settings']),
    currencyDropdownOptions() {
      if (this.currencyRates && this.currencyRates.aeternity && this.balance) {
        return Object.keys(this.currencyRates.aeternity)
          .map((key) => ({
            text: `${this.getFiatVal(this.balance, this.currencyRates.aeternity[key])} ${key.toUpperCase()}`,
            value: key,
          }));
      }
      return null;
    },
    roundAE() {
      return new BigNumber(this.balance).toFixed(2);
    },
    downloadUrl() {
      if (this.browser) {
        switch (this.browser.name) {
          case 'firefox':
            return '//addons.mozilla.org/en-US/firefox/addon/superhero-wallet/';
          case 'chrome':
          case 'opera':
          case 'vivaldi':
          case 'brave': // might not be detected from browser-detect
          case 'edge-chromium':
            return '//chrome.google.com/webstore/detail/mnhmmkepfddpifjkamaligfeemcbhdne/';
          default:
            break;
        }
      }
      return '//github.com/aeternity/superhero-wallet/releases/latest/';
    },
  },
  methods: {
    ...mapActions(['updateCurrency']),
    selectCurrency(selectedCurrency) {
      this.updateCurrency(selectedCurrency);
    },
    getFiatVal(value, rate) {
      return new BigNumber(value).multipliedBy(rate).toFixed(2);
    },
  },
};
</script>

<style lang="scss">
.topics-section {
  transition: max-height 0.25s ease-in;

  &.active {
    max-height: 25rem;
  }
}

.app__rightcolumn {
  color: $light_font_color;
  font-size: 0.75rem;

  .content {
    max-width: 18rem;

    .section {
      background-color: $article_content_color;
      border-radius: 0.5rem;
      margin-bottom: 1rem;

      &.trending {
        margin-bottom: 0.85rem;
        padding-bottom: 0.5rem;

        .section__item {
          display: flex;

          & > div {
            &.ae-amount-fiat {
              width: 52%;

              .ae-amount {
                color: $standard_font_color;
              }
            }

            width: 48%;
          }
        }

        .section__body {
          padding-bottom: 0.25rem;
          -ms-overflow-style: none;
          overflow-y: auto;
          scrollbar-width: none;

          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }

    .section__title {
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.65rem 0.75rem;
    }

    .section__body {
      padding: 0.25rem 1rem 1rem 1rem;

      .section__item {
        font-size: 0.75rem;
        margin: 0.5rem 0;
        text-transform: none;

        &:first-child {
          margin-top: 0;
        }

        .ae {
          color: $secondary_color;
        }
      }

      .tag {
        color: $custom_links_color;
      }
    }

    .wallet-install {
      margin-bottom: 0.85rem;
      max-height: 400px;
      transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
      display: block;

      .account {
        color: $light_font_color;
        font-size: 0.52rem;
        padding: 0 0.2rem;
      }

      .balance {
        font-size: 1.3rem;
        color: $standard_font_color;
        width: calc(100% - 8rem);
      }

      .section__body > div {
        display: flex;
      }

      .dropdown {
        max-width: 8rem;
      }

      .choose-fiat {
        width: 8rem;
        text-align: right;
      }
    }
  }
}

//Fixes issue: Smaller screens cut part of the footer
@media (max-width: 1280px) {
  .topics-section.active {
    max-height: 10rem;
  }
}

@media (min-width: 768px) {
  .app__rightcolumn .content .section__body .section__item {
    font-size: 0.65rem;
  }
}

@media (min-width: 992px) {
  .app__rightcolumn .content .section__body .section__item {
    font-size: 0.75rem;
  }
}
</style>
