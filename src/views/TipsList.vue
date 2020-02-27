<template>
  <div>
    <div class="actions__container">
      <div class="container">
        <div class="row">
          <div class="input-group col-md-12 col-lg-6 col-sm-12">
            <input type="text" v-model="searchTerm" class="form-control" v-bind:placeholder="$t('pages.Home.SearchPlaceholder')">
          </div>
          <div class="col-md-12 col-lg-6 col-sm-12 sorting">
            <a v-if="this.tipsOrdering" v-on:click="sort('hot')"
                v-bind:class="{ active: sorting === 'hot' }"> {{$t('pages.Home.SortingHot')}}</a>
            <a v-on:click="sort('latest')" v-bind:class="{ active: sorting === 'latest' }">{{$t('pages.Home.SortingLatest')}}</a>
            <a v-on:click="sort('highest')" v-bind:class="{ active: sorting === 'highest' }">
              {{$t('pages.Home.SortingHighestRated')}}
            </a>
          </div>
        </div>
        </div>
    </div>
    <div class="text-center spinner__container" v-bind:class="{ active: !showLoading }">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="container wrapper">
      <div class="tips__container">
        <tip-record v-for="(tip,index) in filteredTips" :key="index" :tip="tip" :foundWallet="foundWallet" :retip="retip" :defaultCurrency="defaultCurrency" :fiatValue="tip.fiatValue" :senderLink="openExplorer(tip.sender)"></tip-record>
      </div>
    </div>
    <div class="no-results text-center" v-if="filteredTips !== null && !showLoading && filteredTips.length === 0">{{$t('pages.Home.NoResultsMsg')}}</div>
  </div>
</template>

<script>
  import aeternity from '../utils/aeternity';
  import {wallet} from '../utils/walletSearch.js'
  import Backend from "../utils/backend";
  import Currency from "../utils/currency";
  import util from "../utils/util";

  import Dropdown from "../components/DropdownComponent.vue"

  import {langs, fetchAndSetLocale} from '../utils/i18nHelper'

  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"

  export default {
    name: 'TipsList',
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        showLoading: true,
        tips: null,
        tipsOrdering: null,
        searchTerm: '',
        sorting: "latest",
        foundWallet: false,
        activeLang: 'en',
        languagesOptions: [
          { value: 'en', text: 'English' },
          { value: 'zh', text: 'Chinese' },
        ],
        defaultCurrency: 'eur',
        currencies: [
          { value: 'eur', text: 'EUR'},
          { value: 'cny', text: 'YEN'},
          { value: 'usd', text: 'USD'},
        ]
      }
    },
    computed: {
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
      switchLanguage(languageChoose) {
        fetchAndSetLocale(languageChoose);
        this.activeLang = languageChoose;
        if(languageChoose === 'zh'){
          this.defaultCurrency = 'cny';
        }else{
          this.defaultCurrency = 'eur';
        }
        this.reloadData();
      },
      sort(sorting) {
        this.sorting = sorting;

        switch (this.sorting) {
          case "hot":
            this.tips.sort((a, b) => b.score - a.score);
            break;
          case "latest":
            this.tips.sort((a, b) => b.received_at - a.received_at);
            break;
          case "highest":
            this.tips.sort((a, b) => b.amount - a.amount);
            break;
        }
      },
      async retip(url) {
        const amount = util.aeToAtoms(prompt("Tip Amount in AE?"));
        this.showLoading = true;
        await aeternity.contract.methods.tip(url, undefined, {amount: amount}).catch(console.error);
        this.reloadData();
      },
      async asyncAddCurrency() {
        new Currency().getRates().then(rates => {
          this.tips = this.tips.map(tip => {
            tip.fiatValue = (tip.amount * rates.aeternity[this.defaultCurrency]).toFixed(2);
            return tip;
          }).filter(tip => tip.amount * (rates.aeternity['usd']).toFixed(2) > 0.01);
        }).catch(console.error);
      },
      async reloadData(initial = false) {
        this.showLoading = true;
        const fetchTips = async () => {
          if (initial) {
            await aeternity.initClient();
            wallet.init(() => {
              this.foundWallet = true;
              console.log("found wallet")
            }).catch(console.error);
          }
          return aeternity.getTips().catch(console.error);
        };

        const backendInstance = new Backend();
        const fetchOrdering = backendInstance.tipOrder().catch(console.error);
        const fetchTipsPreview = backendInstance.tipPreview().catch(console.error);
        const fetchLangTips = backendInstance.getLangTips(this.activeLang).catch(console.error);
        let [tips, tipOrdering, tipsPreview, langTips] = await Promise.all([fetchTips(), fetchOrdering, fetchTipsPreview, fetchLangTips]);
        this.tipsOrdering = tipOrdering;
        this.tipsPreview = tipsPreview;

        // add score from backend to tips
        if (this.tipsOrdering) {
          const blacklistedTipIds = tipOrdering.map(order => order.id);
          const filteredTips = tips.filter(tip => blacklistedTipIds.includes(tip.tipId));
          tips = filteredTips.map(tip => {
            const orderItem = tipOrdering.find(order => order.id === tip.tipId);
            tip.score = orderItem ? orderItem.score : 0;
            return tip;
          });
          if (initial) this.sorting = "hot";
        }

        // filter tips by language from backend
//        if (langTips) tips = tips.filter(tip => langTips.some(url => tip.url === url));

        // add preview to tips from backend
        if (this.tipsPreview) {
          tips = tips.map(tip => {
            tip.preview = tipsPreview.find(preview => preview.requestUrl === tip.url);
            return tip;
          });
        }

        this.tips = tips;

        this.asyncAddCurrency();
        this.sort(this.sorting);
        this.showLoading = false;
      }
    },
    components: {
      'dropdown-component': Dropdown,
      'tip-record': TipRecord
    },
    async created() {
      await this.reloadData(true);
      setInterval(() => this.reloadData(), 120 * 1000);
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
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 2;
      width: 100%;
      font-size: .75rem;
      margin: 0 1rem 0 0;
      .row{
        padding: .5rem 1rem .5rem 1rem;
        background-color: $actions_ribbon_background_color;
        border-top-right-radius: .25rem;
        border-top-left-radius: .25rem;
        margin: 0;
      }
      .input-group{
        padding-left: 0;
        padding-right: 0;
        .form-control{
          background-color: $background_color;
          color: $standard_font_color;
          font-size: .75rem;
          border: 1px solid $white_color;
        }
        .input-group-text{
          background-color: $search_icon_backgound;
          border: 1px solid $white_color;
          &:hover{
            cursor: pointer;
            background-color: $primary_color;
            .fas.fa-search{
              color: $search_icon_hover_color;
            }
          }
          &:active{
             background-color: $secondary_color;
          }
        }
        .fas.fa-search{
          color: $standard_font_color;
        }
      }
      .sorting{
        border-radius: .25rem;
        color: $light_font_color;
        text-align: right;
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
    padding: 1rem;
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
