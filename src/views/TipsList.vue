<template>
  <div>
    <div class="actions__container container position-sticky">
      <div class="input-group mb-1">
        <input type="text" v-model="searchTerm" @searchTopic="onSearchTopic" class="form-control" v-bind:placeholder="$t('pages.Home.SearchPlaceholder')">
        <div v-if="searchTerm.length" @click="searchTerm = ''" class="clear">&#x2715;</div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-12 col-sm-12 sorting">
          <a v-if="this.tipsOrdering" v-on:click="setTipSortBy('hot')" v-bind:class="{ active: tipSortBy === 'hot' }">
            {{$t('pages.Home.SortingMostPopular')}}
          </a>
          <a v-on:click="setTipSortBy('latest')" v-bind:class="{ active: tipSortBy === 'latest' }">
            {{$t('pages.Home.SortingLatest')}}
          </a>
          <a v-on:click="setTipSortBy('highest')" v-bind:class="{ active: tipSortBy === 'highest' }">
            {{$t('pages.Home.SortingHighestRated')}}
          </a>
        </div>
      </div>
    </div>
    <loading :show-loading="loading.tips" class="loading-position" />
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper">
      <div class="tips__container">
        <send-tip></send-tip>
        <tip-record v-for="(tip,index) in filteredTips" :key="index" :tip="tip" :fiatValue="tip.fiatValue"
                    :senderLink="openExplorer(tip.sender)"></tip-record>
      </div>
    </div>
    <div class="no-results text-center" v-if="filteredTips !== null && !loading.tips && filteredTips.length === 0">{{$t('pages.Home.NoResultsMsg')}}</div>
  </div>
</template>

<script>
  import Dropdown from "../components/Dropdown.vue"

  import TipRecord from "../components/tipRecords/TipRecord.vue"
  import SendTip from "../components/layout/SendTip.vue"
  import LeftSection from '../components/layout/LeftSection.vue';
  import RightSection from '../components/layout/RightSection.vue';
  import { mapGetters, mapActions } from 'vuex';
  import {EventBus} from '../utils/eventBus';
  import FiatValue from '../components/FiatValue.vue';
  import Loading from "../components/Loading";

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
        ]
      }
    },
    computed: {
      ...mapGetters(['tips', 'tipsOrdering', 'tipSortBy', 'account', 'balance', 'isLoggedIn', 'loading']),
      filteredTips() {
        if (this.searchTerm.trim().length === 0) {
          return this.tips
        }
        let term = this.searchTerm.toLowerCase();

        let urlSearchResults = this.tips.filter(tip => {
          if (typeof tip.url !== 'undefined') {
            return tip.url.toLowerCase().includes(term)
          }
          return false
        })
        let senderSearchResults = this.tips.filter(tip => {
          if (typeof tip.sender !== 'undefined') {
            return tip.sender.toLowerCase().includes(term)
          }
          return false
        })
        let noteSearchResults = this.tips.filter(tip => {
          if (typeof tip.title !== 'undefined') {
            return tip.title.toLowerCase().includes(term)
          }
          return false
        })
        //We convert the result array to Set in order to remove duplicate records
        let convertResultToSet = new Set([...urlSearchResults, ...senderSearchResults, ...noteSearchResults]);
        return [...convertResultToSet];
      }
    },
    methods: {
      ...mapActions(['setTipSortBy']),
      onSearchTopic (data) {
        this.searchTerm = data;
      },
      openExplorer(address) {
        return this.explorerUrl + address
      }
    },
    components: {
      Loading,
      Dropdown,
      TipRecord,
      LeftSection,
      RightSection,
      FiatValue,
      SendTip,
    },
    async created() {
      EventBus.$on("searchTopic", (topic) => {
        this.onSearchTopic(topic);
      });

      if(this.$route.query.searchTopicPhrase){
        this.onSearchTopic(this.$route.query.searchTopicPhrase);
      }
    },
  }
</script>


<style lang="scss" scoped>
  @import "../styles/base";

  .header{
    h2{
      color: $standard_font_color;
    }
    p{
      color: $light_font_color;
    }
    a{
      color: $custom_links_color;
    }
  }
  .search-icon {
    height: 1rem;
  }

  .loading-position {
    position: fixed;
    left: 50%;
    transform: translate( -50%);
    z-index: 3;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .container.wrapper{
    padding-top: 0;
    min-height: 4rem;
  }
   .actions__container{
      top: 0;
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
    $background-color: $background_color;;
    padding-top: 0.1rem;
    &:empty{
      visibility: hidden;
    }
  }

  .clear{
    font-size: .75rem;
    color: $standard_font_color;
    right: .5rem;
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
      .container,.row{
        padding: 0;
      }
      .sorting{
        width: -webkit-fill-available;
        width: -moz-available;
        background-color: #1D1D23;
        margin: .5rem -1rem 0 -1rem;
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
    padding: 1rem .25rem 0 .25rem;
    .tips__container{
      padding: 0;
    }
  }

}
</style>
