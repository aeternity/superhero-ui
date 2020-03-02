<template>
  <div>
    <header-component>
      <div class="actions__container">
        <div class="container">
          <div class="input-group mb-1">
            <input type="text" v-model="searchTerm" @searchTopic="onSearchTopic" class="form-control" v-bind:placeholder="$t('pages.Home.SearchPlaceholder')">
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-12 col-sm-12 sorting">
              <a v-if="this.tipsOrdering" v-on:click="setTipSortBy('hot')" v-bind:class="{ active: tipSortBy === 'hot' }">
                {{$t('pages.Home.SortingHot')}}
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
        <div class="tip__post">
          <form @submit.prevent>
            <div class="form-row">
              <label class="tip__post__label pl-2">Send Tip</label>
            </div>
            <div class="form-row">
              <div class="form-group col-md-3">
                <div class="input-group mb-3">
                  <input type="number" step="0.000001" v-model="sendTipForm.amount" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-mn">
                  <div class="input-group-append">
                    <span class="input-group-text append__ae">AE</span>
                  </div>
                </div>
              </div>
              <div class="form-group col-md-9">
                <input type="text" v-model="sendTipForm.url" class="form-control" placeholder="Enter URL">
              </div>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" v-model="sendTipForm.title" placeholder="Add message">
            </div>
            <div class="form-row">
              <div class="col-sm-4 tip__post__balance pl-2">
                 <span>{{ balance }} AE
                   <fiat-value v-if="balance" :amount="balance"></fiat-value>
                 </span>
              </div>
              <div class="col-sm-4 offset-4 text-right mt-2">
                <button @click="sendTip()" class="btn btn-primary tip__send">Send</button>
              </div>
            </div>
          </form>
        </div>
        <tip-record v-for="(tip,index) in filteredTips" :key="index" :tip="tip" :fiatValue="tip.fiatValue" :senderLink="openExplorer(tip.sender)"></tip-record>
      </div>
    </div>
    <div class="no-results text-center" v-if="filteredTips !== null && !showLoading && filteredTips.length === 0">{{$t('pages.Home.NoResultsMsg')}}</div>
  </div>
</template>

<script>
  import Dropdown from "../components/DropdownComponent.vue"

  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"
  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters, mapActions } from 'vuex';
  import {EventBus} from '../utils/eventBus';
  import util from '../utils/util';
  import aeternity from '../utils/aeternity';
  import FiatValueComponentVue from '../components/FiatValueComponent.vue';

  export default {
    name: 'TipsList',
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        searchTerm: '',
        showLoading: true,
        activeLang: 'en',
        languagesOptions: [
          { value: 'en', text: 'English' },
          { value: 'zh', text: 'Chinese' },
        ],
        sendTipForm: {
          amount: null,
          url: '',
          title: ''
        }
      }
    },
    computed: {
      ...mapGetters(['tips', 'tipsOrdering', 'tipSortBy', 'account', 'balance', 'isLoggedIn', 'current']),
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
      async sendTip(){
        const amount = util.aeToAtoms(this.sendTipForm.amount);
        await aeternity.contract.methods.tip(this.sendTipForm.url, this.sendTipForm.title, {amount: amount}).catch(console.error);
        this.clearTipForm();
        EventBus.$emit('reloadData');
      },
      clearTipForm() {
        this.sendTipForm = { amount: null, url: '', title: '' }
      },
      onSearchTopic (data) {
        this.searchTerm = data;
      },
      openExplorer(address) {
        return this.explorerUrl + address
      },
      showLoadingTips() {
        let load = setInterval(() => {
          if (this.tips.length > 0){
            this.showLoading = false;
            clearInterval(load);
          }
        }, 200);
      }
    },
    components: {
      'dropdown-component': Dropdown,
      'tip-record': TipRecord,
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
      'fiat-value': FiatValueComponentVue,
    },
    async created() {
      EventBus.$on("searchTopic", (topic) => {
        this.onSearchTopic(topic);
      });

      this.showLoadingTips();
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
     font-size: .75rem;
      background-color: $background_color;
     .container{
       padding: 0;
     }
      .row{
        background-color: $actions_ribbon_background_color;
        border-top-right-radius: .25rem;
        border-top-left-radius: .25rem;
        margin: 0;
      }
      .sorting{
        border-radius: .25rem;
        text-align: left;
        padding-left: 1rem;
        a{
          display: inline-block;
          padding: .45rem .45rem .45rem .45rem;
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
          border-bottom: .065rem solid $custom_links_color;
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

  .tip__post {
    background-color: #272830;
    padding: 1rem;
    form {
      span.append__ae {
        font-size: 0.75rem;
        background: $background_color;
        color: $secondary_color;
        cursor: default;
        &:hover {
          background: $background_color;
          cursor: default;
        }
      }
      .tip__post__label {
        font-weight: 600;
        color: white;
      }
      .form-group {
        margin-bottom: 0;
        input {
          background-color: $background_color;
          color: #FFF;
          font-size: .75rem;
          border: 1px solid #21212A;
        }
      }
      .tip__post__balance {
        span {
          font-size: 0.75rem;
          color: white;
        }
      }
      .tip__send {
        padding-left: 3rem;
        padding-right: 3rem;
        color: white;
        background-color: $custom_links_color
      }
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
      width: 100%;
      padding-top: .5rem;
      background-color: $actions_ribbon_background_color;
      overflow-x: hidden;
      z-index: 10;
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
      background-color: $background_color;
    }
  }

}
</style>
