<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div class="section" v-if="!isLoggedIn">
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
        <div class="section__body" v-if="topics.length > 0">
          <div class="section__item clearfix" v-for="([topic, data], index) in topics">
            <div class="float-left topic-container">
            <topic :topic="topic" />
          </div>
            <div class="float-right">
              <span class="value">{{data.amount}}</span>
              <span class="ae">AE</span>
              <fiat-value :amount="data.amount"></fiat-value>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix footer">
        <div class="float-left"></div>
        <div class="float-right">
          <router-link class="ae" to="/terms">
            Terms
          </router-link>
          <router-link class="ae" to="/privacy">
            Privacy
          </router-link>
        </div>
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
.app__rightcolumn{
  color: $light_font_color;
  display: inline-block;
  font-weight: 600;
  font-size: .65rem;
  position: fixed;
  right: 0;
  .content{
    width: 12.5rem;
  /* margin-top: 1rem; */
    .section{
      border-radius: .25rem;
      margin-bottom: 1rem;
      background-color: $actions_ribbon_background_color;
      &.trending{
        padding-bottom: .5rem;
        .section__body{
          max-height: 10rem;
          overflow-y: auto;
        }
      }
    }
    .section__title{
      border-top-right-radius: .25rem;
      border-top-left-radius: .25rem;
      padding: .5rem;
      color: $standard_font_color;
    }
    .section__body{
      padding: .5rem;
      .section__item{
        margin: .5rem 0;
        &:first-child{
          margin-top: 0;
        }
        text-transform: none;
        font-size: .45rem;
      }
      .tag{
        color: $custom_links_color;
      }
      .value{
        color: $standard_font_color;
      }
      .topic-container {
        font-size: 0.5rem;
      }
    }
    .side__button{
      font-size: .65rem;
      text-transform: capitalize;
      margin-bottom: 0.7rem;
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
      font-size: .5rem;
      a{
        cursor: pointer;
        text-decoration: underline;

        &.ae{
          color: $secondary_color;
          text-decoration: none;
          font-weight: lighter;
          padding-left: .3rem;
          padding-right: .2rem;
        }
      }
    }
  }
}


@media (min-width: 768px) {
  .app__rightcolumn {
    .content {
      width: 8rem;
    }
  }
}

@media (min-width: 992px) {
  .app__rightcolumn {
    .content {
      width: 10.5rem;
    }
  }
}

@media (min-width: 1200px) {
  .app__rightcolumn {
    .content {
      width: 12rem;
    }
  }
}

@media only screen and (max-width: 768px) {
  .app__rightcolumn {
    .content {
      width: 10rem;
    }
  }
}

</style>
