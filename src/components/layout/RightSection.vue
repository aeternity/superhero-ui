<template>
  <div class="app__rightcolumn">
    <div class="content" v-if="!(loading.wallet || loading.tips)">
      <div class="section wallet-install" v-bind:class="{ active: !isLoggedIn }">
        <div class="section__title">
          <img src="../../assets/iconWallet.svg">
          Wallet
        </div>
        <div class="section__body clearfix">
          <div><a :href="downloadUrl" target="_blank" class="button w-100">Install Wallet</a></div>
        </div>
      </div>
      <div class="section trending">
        <div class="section__title">
          <img src="../../assets/iconTrending.svg">
          Trending
        </div>
        <div class="section__body topics-section" v-bind:class="{ active: topics.length > 0 }">
          <div class="section__item" v-for="([topic, data]) in topics">
            <div class="topic-container text-ellipsis">
            <topic :topic="topic" />
          </div>
            <div>
              <span class="value">{{data.amount}}</span>
              <span class="ae">AE</span>
              <fiat-value :amount="data.amount"></fiat-value>
            </div>
          </div>
        </div>
      </div>
      <div class="footer text-center">
        SuperHero is Open Source
        <router-link class="ae" to="/terms">
          Terms
        </router-link>
        <router-link class="ae" to="/privacy">
          Privacy
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import FiatValue from '../FiatValue.vue';
  import Topic from "../tipRecords/Topic";
  import { detect } from 'detect-browser';

  export default {
    name: 'RightSection',
    components: {
      Topic,
      FiatValue
    },
    data() {
      return {
        browser: detect()
      }
    },
    computed: {
      ...mapGetters(['topics', 'loading', 'isLoggedIn']),
      downloadUrl () {
        if (this.browser) {
          switch(this.browser.name) {
          case 'firefox':
            return '//addons.mozilla.org/en-US/firefox/addon/superhero-wallet/';
            break;
          case 'chrome':
            return '//chrome.google.com/webstore/detail/mnhmmkepfddpifjkamaligfeemcbhdne/';
            break;
          default:
            return '//github.com/aeternity/superhero-wallet/releases/latest/';
            break;
        }
        }
      },
    }
  }
</script>

<style lang="scss">
  .topics-section{
    max-height: 0;
    transition: max-height 0.25s ease-in;

    &.active {
      max-height: 15rem;
    }
  }

.app__rightcolumn{
  color: $light_font_color;
  font-size: .75rem;
  .content{
    max-width: 17rem;
    .section{
      border-radius: .5rem;
      margin-bottom: 1rem;
      background-color: $article_content_color;
      &.trending{
        padding-bottom: .5rem;
        margin-bottom: .5rem;
        .section__item{
          display: flex;
          &>div{
            width: 50%;
          }
        }
        .section__body{
          overflow-y: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
    .section__title{
      padding: .65rem .75rem;
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 600;
    }
    .section__body{
      padding: .25rem 1rem 1rem 1rem;
      .section__item{
        margin: .5rem 0;
        &:first-child{
          margin-top: 0;
        }
        text-transform: none;
        font-size: .75rem;
        .ae{
          color: $secondary_color;
        }
      }
      .tag{
        color: $custom_links_color;
      }
      .value{
        color: $standard_font_color;
      }
    }
    .wallet-install{
      display: none;
      max-height: 0;
      transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
      opacity: 0;
      margin-bottom: 0;

      &.active {
        display: block;
        max-height: 400px;
        opacity: 1;
        margin-bottom: 1rem;
      }
    }
    .footer{
      font-size: .6rem;
      a{
        cursor: pointer;
        text-decoration: underline;

        &.ae{
          color: $secondary_color;
          text-decoration: none;
          font-weight: lighter;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .app__rightcolumn .content .section__body .section__item{
    font-size: .65rem;
  }
}
@media (min-width: 992px) {
  .app__rightcolumn .content .section__body .section__item{
    font-size: .75rem;
  }
}
</style>
