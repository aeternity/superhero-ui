<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div
        v-if="!loading.wallet"
        class="section wallet-install"
        :class="{ active: !isLoggedIn }"
      >
        <div class="section__title">
          <img src="../../assets/iconWallet.svg">
          Wallet
        </div>
        <div class="section__body clearfix">
          <div>
            <a
              :href="downloadUrl"
              target="_blank"
              class="button w-100"
            >
              Install Wallet
            </a>
          </div>
        </div>
      </div>
      <div class="section trending">
        <div class="section__title">
          <img src="../../assets/iconTrending.svg">
          Trending
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
              <topic :topic="topic" />
            </div>
            <div>
              <span class="value">
                <ae-amount
                  :amount="data.amount"
                  :round="2"
                />
              </span>
              <fiat-value :amount="data.amount" />
            </div>
          </div>
        </div>
      </div>
      <footer-section />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { detect } from 'detect-browser';
import FiatValue from '../FiatValue.vue';
import AeAmount from '../AeAmount.vue';
import Topic from '../tipRecords/Topic.vue';
import FooterSection from './FooterSection.vue';

export default {
  name: 'RightSection',
  components: {
    Topic,
    FiatValue,
    AeAmount,
    FooterSection,
  },
  data() {
    return {
      browser: detect(),
    };
  },
  computed: {
    ...mapGetters(['topics', 'loading', 'isLoggedIn']),
    downloadUrl() {
      if (this.browser) {
        switch (this.browser.name) {
          case 'firefox':
            return '//addons.mozilla.org/en-US/firefox/addon/superhero-wallet/';
          case 'chrome':
            return '//chrome.google.com/webstore/detail/mnhmmkepfddpifjkamaligfeemcbhdne/';
          default:
            break;
        }
      }
      return '//github.com/aeternity/superhero-wallet/releases/latest/';
    },
  },
};
</script>

<style lang="scss">
.topics-section {
  max-height: 0;
  transition: max-height 0.25s ease-in;

  &.active {
    max-height: 15rem;
  }
}

.app__rightcolumn {
  color: $light_font_color;
  font-size: .75rem;

  .content {
    max-width: 17rem;

    .section {
      background-color: $article_content_color;
      border-radius: .5rem;
      margin-bottom: 1rem;

      &.trending {
        margin-bottom: .5rem;
        padding-bottom: .5rem;

        .section__item {
          display: flex;

          & > div {
            width: 50%;
          }
        }

        .section__body {
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
      padding: .65rem .75rem;
    }

    .section__body {
      padding: .25rem 1rem 1rem 1rem;

      .section__item {
        font-size: .75rem;

        margin: .5rem 0;

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

      .value {
        color: $standard_font_color;
      }
    }
    .wallet-install {
      display: none;
      margin-bottom: 0;
      max-height: 0;
      opacity: 0;
      transition: max-height 0.25s ease-in, opacity 0.25s ease-in;

      &.active {
        display: block;
        margin-bottom: 1rem;
        max-height: 400px;
        opacity: 1;
      }
    }
  }
}

//Fixes issue: Smaller screens cut part of the footer
@media (max-width: 1280px) {
  .topics-section.active {
    max-height: 12rem;
  }
}

@media (min-width: 768px) {
  .app__rightcolumn .content .section__body .section__item {
    font-size: .65rem;
  }
}

@media (min-width: 992px) {
  .app__rightcolumn .content .section__body .section__item {
    font-size: .75rem;
  }
}
</style>
