<template>
  <div>
    <right-section></right-section>
    <left-section></left-section>
    <loading class="mt-5" v-if="loading.wallet || loading.initial" :show-loading="true"/>
    <div v-else>
      <div class="actions__container container position-sticky">
      <div class="search__input__container">
        <input
          type="text"
          v-model="searchTerm"
          @searchTopic="onSearchTopic"
          class="search__input"
          v-bind:placeholder="$t('pages.Home.SearchPlaceholder')"
        >
        <div v-if="searchTerm.length" @click="searchTerm = ''" class="clear">&#x2715;</div>
      </div>
      </div>
      <loading :show-loading="loading.tips" class="loading-position"/>
      <div class="container wrapper">
        <div class="tips__container">
          <div class="send__tip__container">
            <send-tip></send-tip>
          </div>
          <div class="actions__container position-sticky">
            <div class="row">
              <div class="col-md-12 col-lg-12 col-sm-12 sorting">
                <a
                  v-if="this.tipsOrdering"
                  v-on:click="setTipSortBy('hot')"
                  v-bind:class="{ active: tipSortBy === 'hot' }"
                >
                  {{$t('pages.Home.SortingMostPopular')}}
                </a>
                <a
                  v-on:click="setTipSortBy('latest')"
                  v-bind:class="{ active: tipSortBy === 'latest' }"
                >
                  {{$t('pages.Home.SortingLatest')}}
                </a>
                <a
                  v-on:click="setTipSortBy('highest')"
                  v-bind:class="{ active: tipSortBy === 'highest' }"
                >
                  {{$t('pages.Home.SortingHighestRated')}}
                </a>
              </div>
            </div>
          </div>
          <tip-record
            v-for="(tip,index) in filteredTips"
            :key="index"
            :tip="tip"
            :fiatValue="tip.fiatValue"
            :senderLink="openExplorer(tip.sender)"
          />
        </div>
      </div>
      <div
        class="no-results text-center"
        v-if="filteredTips !== null && !loading.tips && filteredTips.length === 0"
      >
        {{$t('pages.Home.NoResultsMsg')}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import TipRecord from '../components/tipRecords/TipRecord.vue';
import SendTip from '../components/layout/SendTip.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import { EventBus } from '../utils/eventBus';
import Loading from '../components/Loading.vue';

export default {
  name: 'TipsList',
  data() {
    return {
      explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
      searchTerm: '',
      activeLang: 'en',
      languagesOptions: [
        { value: 'en', text: 'English' },
        { value: 'zh', text: 'Chinese' },
      ],
    };
  },
  computed: {
    ...mapGetters(['tips', 'tipsOrdering', 'tipSortBy', 'account', 'balance', 'isLoggedIn', 'loading']),
    filteredTips() {
      if (this.searchTerm.trim().length === 0) {
        return this.tips;
      }
      const term = this.searchTerm.toLowerCase();

      const urlSearchResults = this.tips.filter((tip) => {
        if (typeof tip.url !== 'undefined') {
          return tip.url.toLowerCase().includes(term);
        }
        return false;
      });
      const senderSearchResults = this.tips.filter((tip) => {
        if (typeof tip.sender !== 'undefined') {
          return tip.sender.toLowerCase().includes(term);
        }
        return false;
      });
      const noteSearchResults = this.tips.filter((tip) => {
        if (typeof tip.title !== 'undefined') {
          return tip.title.toLowerCase().includes(term);
        }
        return false;
      });
      // We convert the result array to Set in order to remove duplicate records
      const convertResultToSet = new Set(
        [...urlSearchResults, ...senderSearchResults, ...noteSearchResults],
      );
      return [...convertResultToSet];
    },
  },
  methods: {
    ...mapActions(['setTipSortBy']),
    onSearchTopic(data) {
      this.searchTerm = data;
    },
    openExplorer(address) {
      return this.explorerUrl + address;
    },
  },
  components: {
    Loading,
    TipRecord,
    LeftSection,
    RightSection,
    SendTip,
  },
  async created() {
    EventBus.$on('searchTopic', (topic) => {
      this.onSearchTopic(topic);
    });

    if (this.$route.query.searchTopicPhrase) {
      this.onSearchTopic(this.$route.query.searchTopicPhrase);
    }
  },
};
</script>


<style lang="scss" scoped>
  .search__input__container{
    margin-bottom: .15rem;
    position: relative;
  }

  .search__input{
    font-size: .75rem;
    color: $standard_font_color;
    background-color: $article_content_color;
    padding: 1.05rem 2.5rem 1.05rem 1rem;
    border: .05rem solid transparent;
    outline: none;
    width: 100%;
    &:focus{
      border: .05rem solid $custom_links_color;
    }
  }

  .loading-position {
    position: fixed;
    left: 50%;
    transform: translate( -50%);
    z-index: 3;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .send__tip__container{
    margin-bottom: .15rem;
  }
  .container.wrapper{
    padding-top: 0;
    margin-top: -0.125rem;
    min-height: 4rem;
  }
   .actions__container{
      padding: 0;
      top: 0;
      &:nth-child(2){
        top: 3.2rem;
      }
      z-index: 100;
      font-size: .75rem;
      background-color: $background_color;
      .form-control{
        padding-right: 1.25rem;
      }
      .container{
        padding: 0;
      }
      .row{
        background-color: $actions_ribbon_background_color;
        margin: 0;
      }
      .sorting{
        text-align: left;
        padding-left: 1rem;
        a{
          font-weight: 600;
          display: inline-block;
          padding: .625rem 0;
          margin-right: 1rem;
          color: $light_font_color;
          &:last-child{
            margin-right: 0;
          }
          &:hover{
            color: $primary_color;
            cursor: pointer;
          }
        }
        a.active{
          color: $custom_links_color;
          border-bottom: .1rem solid $custom_links_color;
        }
      }
  }
  .tips__container{
    width: 100%;
    background-color: $background_color;
    padding-top: 0.1rem;
    &:empty{
      visibility: hidden;
    }
  }

  .clear{
    font-size: .75rem;
    color: $standard_font_color;
    right: 1rem;
    @include vertical-align($position: absolute);
    z-index: 10;
    &:hover{
      cursor: pointer;
    }
  }

  .no-results{
    color: $standard_font_color;
    font-size: .75rem;
    margin-bottom: 4rem;
  }

@media only screen and (max-width: 768px){
  .actions__container .input-group{
    margin-bottom: 1rem;
    padding-right: 0;
  }
  .actions__container{
    padding-bottom: 0;
    .input-group{
      margin-bottom: 0;
    }
  }
}

@media only screen and (max-width: 600px) {
  .actions__container .input-group{
    margin-bottom: 1rem;
    padding-right: 0;
  }
  .actions__container{
    padding-bottom: 0;
    .input-group{
      margin-bottom: 0;
    }
  }
}

@media (min-width: 992px) {
  .loading-position {
    left: calc(50% - 3rem);
  }
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {

  .actions__container{
      width: 100%;
      padding-top: .5rem;
      background-color: $actions_ribbon_background_color;
      overflow-x: hidden;
      z-index: 100;
      padding-bottom: .5rem;
      &:nth-child(2){
        width: 100vw;
        margin-left: -.2rem;
        top: 4.45rem;
        padding-top: 0;
        padding-bottom: 0;
      }
      .container,.row{
        padding: 0;
      }
      .sorting{
        width: -webkit-fill-available;
        width: -moz-available;
        background-color: #1D1D23;
        margin: 0 -1rem 0 -1rem;
        text-align: center;
        padding-bottom: 0;
        padding-left: .5rem;
        border-bottom: .075rem solid $search_nav_border_color;
        a{
          cursor: pointer;
          width: 32.5%;
          display: inline-block;
          padding-bottom: .45rem;
          margin-right: 0;
          &.active{
            border-bottom: .075rem solid $custom_links_color;
            margin-bottom: -.075rem;
          }
        }
      }
    }
  .container.wrapper{
    padding: .15rem .25rem 0 .25rem;
    .tips__container{
      padding: 0;
    }
  }

}
</style>
