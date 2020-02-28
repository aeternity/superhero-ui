<template>
  <div>
    <header-component>
      <div class="actions__container">
      <div class="container">
        <div class="row">
          <div class="input-group col-md-12 col-lg-12 col-sm-12">
            <input type="text" v-model="searchTerm" class="form-control" v-bind:placeholder="$t('pages.Home.SearchPlaceholder')">
          </div>
          <div class="col-md-12 col-lg-12 col-sm-12 sorting">
            <a v-if="this.tipsOrdering" v-on:click="sort('hot')" v-bind:class="{ active: sorting === 'hot' }">
              {{$t('pages.Home.SortingHot')}}
            </a>
            <a v-on:click="sort('latest')" v-bind:class="{ active: sorting === 'latest' }">
              {{$t('pages.Home.SortingLatest')}}
            </a>
            <a v-on:click="sort('highest')" v-bind:class="{ active: sorting === 'highest' }">
              {{$t('pages.Home.SortingHighestRated')}}
            </a>
          </div>
        </div>
        </div>
      </div>
    </header-component>
    <div class="text-center spinner__container" v-bind:class="{ active: !showLoading }">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper">
      <div class="tips__container">
        <tip-record v-for="(tip,index) in filteredTips" :key="index" :tip="tip" :foundWallet="foundWallet" :retip="retip" :fiatValue="tip.fiatValue" :senderLink="openExplorer(tip.sender)"></tip-record>
      </div>
    </div>
    <div class="no-results text-center" v-if="filteredTips !== null && !showLoading && filteredTips.length === 0">{{$t('pages.Home.NoResultsMsg')}}</div>
  </div>
</template>

<script>
  import aeternity from '../utils/aeternity';
  import {wallet} from '../utils/walletSearch.js'
  import util from "../utils/util";

  import Dropdown from "../components/DropdownComponent.vue"

  import {langs, fetchAndSetLocale} from '../utils/i18nHelper'

  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"
  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'TipsList',
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        searchTerm: '',
        sorting: "hot",
        showLoading: false,
        foundWallet: false,
        activeLang: 'en',
        languagesOptions: [
          { value: 'en', text: 'English' },
          { value: 'zh', text: 'Chinese' },
        ],
      }
    },
    computed: {
      ...mapGetters(['tips', 'tipsOrdering', 'account', 'current', 'mainLoading', 'sdk', 'isLoggedIn']),
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
          if (typeof tip.note !== 'undefined') {
            return tip.note.toLowerCase().includes(term)
          }
          return false
        })
        //We convert the result array to Set in order to remove duplicate records
        let convertResultToSet = new Set([...urlSearchResults, ...senderSearchResults, ...noteSearchResults]);
        return [...convertResultToSet];
      }
    },
    methods: {
      openExplorer(address) {
        return this.explorerUrl + address
      },
      // switchLanguage(languageChoose) {
      //   fetchAndSetLocale(languageChoose);
      //   this.activeLang = languageChoose;
      //   if(languageChoose === 'zh'){
      //     this.defaultCurrency = 'cny';
      //   }else{
      //     this.defaultCurrency = 'eur';
      //   }
      //   // this.reloadData();
      // },
      sort(sorting) {
        this.sorting = sorting;

        switch (this.sorting) {
          case "hot":
            this.tips.sort((a, b) => b.score - a.score);
            this.$store.commit('UPDATE_TIPS', this.tips)
            break;
          case "latest":
            this.tips.sort((a, b) => b.received_at - a.received_at);
            this.$store.commit('UPDATE_TIPS', this.tips)
            break;
          case "highest":
            this.tips.sort((a, b) => b.amount - a.amount);
            this.$store.commit('UPDATE_TIPS', this.tips)
            break;
        }
      },
      async retip(url) {
        const amount = util.aeToAtoms(prompt("Tip Amount in AE?"));
        this.showLoading = true;
        await aeternity.contract.methods.tip(url, undefined, {amount: amount}).catch(console.error);
        // this.reloadData();
      },
    },
    components: {
      'dropdown-component': Dropdown,
      'tip-record': TipRecord,
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
    },
    created() {
      console.log(this.tips)
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

  .spinner__container{
    margin-top: 1rem;
    margin-bottom: 1rem;
    max-height: 200px;
    opacity: 100%;
    transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
    position: fixed;
    left: 50%;
    transform: translate( -50%);
    z-index: 3;
    &.active {
      max-height: 0;
      opacity: 0;
    }
  }
  .container.wrapper{
    min-height: 4rem;
  }
   .actions__container{
      .row{
        background-color: $actions_ribbon_background_color;
        padding: .5rem 1rem .5rem 1rem;
        border-top-right-radius: .25rem;
        border-top-left-radius: .25rem;
        margin: 0;
      }
      .sorting{
        border-radius: .25rem;
        color: $light_font_color;
        text-align: left;
        padding-left: 1rem;
        padding: .45rem 0 .45rem .45rem;
        a{
          margin-right: .5rem;
          &:last-child{
            margin-right: 0;
          }
          &:hover{
            color: $primary_color;
            cursor: pointer;
          }
          &:active{
            color: $secondary_color;
          }
        }
        a.active{
          color: $secondary_color;
        }
      }
    }
  .tips__container{
    width: 100%;
    background-color: $tip_list_background_color;
    padding-top: 0.1rem;
    &:empty{
      visibility: hidden;
    }
  }

  .no-results{
    color: $standard_font_color;
    font-size: .75rem;
    margin-bottom: 4rem;
  }

@media only screen and (max-width: 1024px){
   .actions__container .sorting{
    padding-top: .45rem;
  }
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
      width: 100vw;
      max-width: 100vw;
      padding: .5rem .5rem 0 .5rem;
      background-color: $actions_ribbon_background_color;
      overflow-x: hidden;
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
            border-bottom: .075rem solid $secondary_color;
            margin-bottom: -.075rem;
          }
        }
      }
    }
  .container.wrapper{
    padding: 1rem .25rem 0 .25rem;
    .tips__container{
      padding: 0;
      background-color: $background_color;
    }
  }

}
</style>
