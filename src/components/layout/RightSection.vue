<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div class="section wallet-install" v-bind:class="{ active: !isLoggedIn }">
        <div class="section__title">
          <img src="../../assets/iconWallet.svg">
          Wallet
        </div>
        <div class="section__body clearfix">
          <div class="side__button"><a href="//github.com/superherowallet/wallet/releases/latest">Install Wallet</a></div>
        </div>
      </div>
      <div class="section trending">
        <div class="section__title">
          <img src="../../assets/iconTrending.svg">
          Trending
        </div>
        <div class="section__body topics-section" v-bind:class="{ active: topics.length > 0 }">
          <div class="section__item" v-for="([topic, data], index) in topics">
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

  export default {
    name: 'RightSection',
    components: {
      Topic,
      FiatValue
    },
    data() {
      return {}
    },
    computed: {
      ...mapGetters(['topics', 'isLoggedIn']),
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/base";

  .wallet-install{
    max-height: 0;
    transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
    opacity: 0;

    &.active {
      max-height: 400px;
      opacity: 100%;
    }
  }

  .topics-section{
    max-height: 0;
    transition: max-height 0.25s ease-in;

    &.active {
      max-height: 10rem;
    }
  }

.app__rightcolumn{
  color: $light_font_color;
  display: inline-block;
  font-size: .75rem;
  position: fixed;
  right: 0;
  top: 0;
  padding-top: .9rem;
  .content{
    max-width: 17rem;
    .section{
      border-radius: .25rem;
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
      border-top-right-radius: .25rem;
      border-top-left-radius: .25rem;
      padding: .5rem;
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 600;
    }
    .section__body{
      padding: .5rem;
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
    .side__button{
      text-transform: capitalize;
      margin-bottom: 0.7rem;
      font-weight: 600;
      &:hover{
        cursor: pointer;
      }
    }
    .side__button{
      color: $custom_links_color;
      border: .065rem solid $custom_links_color;
      border-radius: .25rem;
      padding: .2rem .5rem .2rem .5rem;
      text-align: center;
      &.secondary{
        color: $secondary_color;
        border: .065rem solid $secondary_color;
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
