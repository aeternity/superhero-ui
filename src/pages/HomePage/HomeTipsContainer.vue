<template>
  <div>
    <div class="tips__container pt-3 pr-5">
      <div class="clearfix actions__container mb-3">
        <div class="input-group float-left">
          <input type="text" v-model="searchTerm" class="form-control" placeholder="Search for a tip record...">
          <div class="input-group-append">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
          </div>
        </div>
        <div class="float-left sorting">
          <a class="mr-2">Latest</a>
          <a class="mr-2">Most Popular</a>
          <a class="mr-2">Curators Choice</a>
        </div>
      </div>
      <div class="text-center spinner__container">
        <div class="spinner-border text-primary" v-show="!client || showLoading" role="status">
          <span class="sr-only">Loading...</span>
        </div> 
      </div>
      <div class="no-results mb-3 text-center" v-if="filteredTips !== null && filteredTips.length == 0">There are no results found</div>
      <div v-for="(tip,index) in filteredTips" :key="index" class="tip__record clearfix pt-2 pl-3 pr-3 mb-3">
        <div class="tip__body float-left">
          <div class="clearfix">
            <div class="tip__actions float-left  mr-2">
              <button class="btn btn-sm btn-light mr-1"><img src="../../resources/images/likeIcon.png"></button>
              <button class="btn btn-sm btn-light"><img src="../../resources/images/commentIcon.png"></button>
            </div>
            <div class="tip__note float-left pr-2" :title="tip.note">
                {{ tip.note }}
            </div>
          </div>
          <div>
            <a class="tip__url mb-2 text-ellipsis pr-2" :title="tip.url">{{tip.url}}</a>
          </div>
          <div class="tip__footer clearfix ml-n3 pl-3 pr-3 pb-1 pt-1 text-ellipsis">
            <span class="tip__date mr-2">
              {{ new Date(tip.received_at).toLocaleString('en-US', { hourCycle: 'h24' }) }}
            </span>
            <span class="tip__amount">
              +{{ tip.amount }} AE 
            </span>
            by
            <span class="tip__sender mr-2" :title="tip.sender">{{ tip.sender }}</span>
            <span class="tip__totalsum mr-2">
              <img src="../../resources/images/likeIcon.png">
                {{ tip.amount }}
            </span>
            <span class="tip__comments mr-2">
              <img src="../../resources/images/commentIcon.png">
              10k
            </span>
            <span class="tip__article__logo">
              <i class="fab fa-facebook-f"></i>
              Facebook
            </span>
          </div>
        </div>
        <div class="tip__article float-right mt-n2 pt-2 pl-2 clearfix">
          <div class="left-arrow"></div>
          <div class="left-arrow filler"></div>
          <div class="tip__article--hasresults">
            <div class="text-ellipsis tip__article__caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</div>
            <img src="https://via.placeholder.com/100x65" class="float-left mr-1">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </span>
          </div>
          <div class="tip__article--noresults">
            No Preview Available
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import 'prismjs'
  import 'prismjs/themes/prism.css'
  import 'prismjs/components/prism-reason.min.js'
  import 'vue-prism-editor/dist/VuePrismEditor.css' // import the styles
  import PrismEditor from 'vue-prism-editor'

  import {Universal} from '@aeternity/aepp-sdk/es/ae/universal'
  import * as Crypto from '@aeternity/aepp-sdk/es/utils/crypto'
  import {AeButton, AeInput, AeLabel, AeList, AeListItem, AeCheck} from '@aeternity/aepp-components'

  import CONTRACT_TIP_ANY from '../../../contracts/tip_any_basic.aes';

  import BiggerLoader from '../../components/common/BiggerLoader'

  export default {
    name: 'TipsList',
      components: {
        AeInput,
        AeButton,
        AeLabel,
        AeList,
        AeListItem,
        AeCheck,
        PrismEditor,
        BiggerLoader
      },
      data() {
        return {
          nodeUrl: "https://sdk-mainnet.aepps.com",
          keypair: Crypto.generateKeyPair(),
          contractCode: CONTRACT_TIP_ANY,
          contractInstance: null,
          contractAddress: 'ct_cT9mSpx9989Js39ag45fih2daephb7YsicsvNdUdEB156gT5C',
          address: null,
          client: null,
          showLoading: true,
          loadingProgress: "",
          allErrors: [],
          tips: null,
          searchTerm: ''
        }
      },
      computed: {
        filteredTips() {
          if(this.searchTerm.trim().length == 0){
            return this.tips
          }
          let term = this.searchTerm.toLowerCase();

          let urlSearchResults = this.tips.filter(tip => {
            if(typeof tip.url !== 'undefined'){
              return tip.url.toLowerCase().includes(term)
            }
            return false
          })
          let senderSearchResults = this.tips.filter(tip => {
             if(typeof tip.sender !== 'undefined'){
              return tip.sender.toLowerCase().includes(term)
            }
            return false
          })
          let noteSearchResults = this.tips.filter(tip => {
            if(typeof tip.note !== 'undefined'){
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
        handleContractError(message) {
          this.showLoading = false;

          const matchFunctionNotFound = message.toString().match(/\.(\w*) is not a function/);
          console.log(matchFunctionNotFound);
          if (matchFunctionNotFound) message = matchFunctionNotFound[1] + " function not defined (maybe commented out?)";

          this.allErrors.push(message);
        },
        async getContractInstanceAtAddress(contractAddress) {
          try {
            this.contractInstance = await this.client.getContractInstance(this.contractCode, { contractAddress });
          } catch (e) {
            console.log(e)
          }
        },
        async getContractState() {
          try {
            const contractState = await this.contractInstance.methods.get_state();
            return contractState.decodedResult;
          } catch (e) {
            console.log(e)
          }
        },
        convertToAE(balance) {
          return +(balance / 10 ** 18).toFixed(7);
        },
        parseTips(tips) {
          let temp = [];
          tips.forEach(t => {
            let p = t[1]
            p.url = t[0][0]
            p.amount = this.convertToAE(p.amount)
            temp.push(p)
          });
          return temp;
        }
      },
      async created() {
          this.loadingProgress = "fetching tips";
          this.client = await Universal({
              url: this.nodeUrl,
              internalUrl: this.nodeUrl,
              keypair: this.keypair,
              networkId: 'ae_mainnet',
              compilerUrl: "https://compiler.aepps.com"
          });

          await this.getContractInstanceAtAddress(this.contractAddress);
          this.tips = await this.getContractState();
          this.tips = this.parseTips(this.tips.tips);
          this.showLoading = false;
      },
  }
</script>

<style lang="scss" scoped>
  @import "../../globalStyles/variables";
  @import "../../globalStyles/mixins";

  .tips__container{
    .no-results{
      color: $standard_font_color;
      font-size: .75rem;
    }
    .actions__container{
      font-size: .75rem;
      .input-group{
        width: 55%;
        .form-control{
          font-size: .75rem;
        }
        .input-group-text{
          background-color: $search_icon_backgound;
          &:hover{
            cursor: pointer;
            background-color: $primary_color;
          }
          &:active{
             background-color: $secondary_color;
          }
        }
        .fas.fa-search{
          color: $white_color;
        }
      }
      .sorting{
        width: 45%;
        background-color: $light_color;
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
        color: $light_font_color;
        text-align: right;
        padding: .45rem;
        a{
          font-weight: 700;
          &:hover{
            color: $primary_color;
            cursor: pointer;
          }
          &:active{
            color: $secondary_color;
          }
        }
      }
    }
    .tip__record{
      background-color: $article_content_color;
      .tip__actions{
        width: 5.3rem;
       .btn-sm img{
         width: 1rem;
        }
      }
      .tip__body{
        width: calc(100% - 12rem);
        .tip__note{
          width: calc(100% - 6rem);
          font-size: .8375rem;
          font-weight: 700;
          color: $standard_font_color;
          @include truncate-overflow-mx(2);
          height: 2.5rem;
        }
        .tip__url{
          color: $primary_color;
          font-size: .75rem;
          cursor: pointer;
          display: block
        }
        .tip__footer{
          background-color: $light_color;
          font-size: .5rem;
          color: $light_font_color;
          .tip__amount{
            color: $secondary_color;
            font-weight: 700;
          }
          .tip__sender{
            color: $primary_color;
            font-weight: 700;
            font-size: .375rem;
          }
          .tip__totalsum, .tip__comments, .tip__article__logo{
            img{
              width: .75rem
            }
          }
          .tip__article__logo{
            font-weight: 700;
            .fa-facebook-f{
              color: #4267B2;
            }
          }
        }
      }
      .tip__article{
        width: 12rem;
        border-left: .05rem solid $border_color;
        min-height: 5.9rem;
        font-size: .5rem;
        position: relative;
        .tip__article__caption{
          font-size: .625rem;
          font-weight: 700;
          color: $standard_font_color;
        }
        img{
          width: 6rem;
          float: left;
          height: 4.125rem;
        }
        span{
          @include truncate-overflow-mx(6);
        }
        .left-arrow {
          @include vertical-align(absolute);
          border-color: transparent $border_color;
          border-style: solid;
          border-width: 10px 10px 10px 0px;
          height: 0px;
          width: 0px;
          left: -.6rem;
        }
        .left-arrow.filler{
          border-color: transparent $article_content_color;
          left: -.52rem;
        }
        // .tip__article--hasresults{
        //   display: none;
        // }
        .tip__article--noresults{
          display: none;
          width: 100%;
          text-align: center;
          @include vertical-align(absolute);
          font-size: .75rem;
          color: $light_font_color;
        }
      }
    }
  }
</style>
