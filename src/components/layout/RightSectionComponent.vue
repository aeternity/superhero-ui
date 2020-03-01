<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div class="section">
        <div class="section__title">
          <img src="../../assets/iconWallet.svg">
          Wallet
        </div>
        <div class="section__body clearfix">
          <div class="side__button"><a>Install Wallet</a></div>
        </div>
      </div>
      <div class="section">
        <div class="section__title">
          <img src="../../assets/iconTrending.svg">
          Trending
        </div>
        <div v-for="(amount, topic) in topics">
        <div class="section__body clearfix">
          <div class="float-left topic" @click="searchTopic(topic)">{{topic}}</div>
          <div class="float-right">
            <span class="value">{{amount}}</span>
            <span class="ae">AE</span>
            <fiat-value :amount="amount"></fiat-value>
          </div>
        </div>
        </div>
      </div>
      <div class="clearfix footer">
        <div class="float-left">&copy; Superhero.</div>
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
  import FiatValueComponentVue from '../FiatValueComponent.vue';
  import {EventBus} from '../../utils/eventBus';

  export default {
    name: 'RightSectionComponent',
    components: {
      'fiat-value': FiatValueComponentVue
    },
    data() {
      return {}
    },
    methods: {
      searchTopic(topic) {
        EventBus.$emit('searchTopic', topic)
      }
    },
    computed: {
      ...mapGetters(['topics']),
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
    margin-top: 1rem;
    .section{
      border-radius: .25rem;
      margin-bottom: 1rem;
      background-color: $actions_ribbon_background_color;
    }
    .section__title{
      border-top-right-radius: .25rem;
      border-top-left-radius: .25rem;
      padding: .5rem;
      color: $standard_font_color;
    }
    .section__body{
      text-transform: none;
      font-size: .45rem;
      padding: .5rem;
      .tag{
        color: $custom_links_color;
      }
      .value{
        color: $standard_font_color;
      }
      .topic{
        font-size: 0.5rem;
        color: #67B6F7;
      }
    }
    .ae{
      color: $secondary_color;
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
