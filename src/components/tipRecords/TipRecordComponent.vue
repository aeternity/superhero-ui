<template>
  <div  class="tip__record row">
    <span class="tip__date--mobile">
      {{ new Date(tip.received_at).toLocaleString('en-US', { hourCycle: 'h24' }) }}
    </span>
    <div class="tip__body " v-bind:class="[ isPreviewToBeVisualized(tip)? 'col-8' : 'col-12']">
      <div class="clearfix">
        <!-- <div class="tip__actions float-left  mr-2">
          <button class="btn btn-sm btn-light mr-1" @click="foundWallet && retip(tip.url)"><img src="../assets/heart.svg"></button>
        </div> -->
        <div class="tip__note pr-2" :title="tip.note" @click="goToTip(tip)">
            {{ tip.note }}
        </div>
      </div>
      <div>
        <a class="tip__url mb-2 text-ellipsis pr-2" :title="tip.url" :href='tip.url' target="_blank">{{tip.url}}</a>
      </div>
      <div class="tip__footer text-ellipsis">
        <div class="row">
          <div class="col-lg-9 col-md-12">
            <span class="tip__amount" @click="foundWallet && retip(tip.url)" title="Send AE to this post">
              <img src="../../assets/heart.svg"> {{ tip.amount }} <span>AE</span>
            </span>
            <span class="currency-value">
                (~ {{ fiatValue }} {{defaultCurrency.toUpperCase()}})
            </span>
            <comment-modal :sendComment="sendComment" :tip="tip"></comment-modal>
            <span class="tip__sender" :title="tip.sender">
              <span>{{$t('system.by')}}</span> 
              <a v-if="senderLink" :href="senderLink" target="_blank">{{ tip.sender }}</a>
              <span class="tip__sender" v-else> {{ tip.sender }}</span>
              </span>
          </div>
          <div class="col-lg-3 col-md-12 tip__date" >
            <span>
              {{ new Date(tip.received_at).toLocaleString('en-US', { hourCycle: 'h24' }) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="tip__article col-4" v-if="isPreviewToBeVisualized(tip)">
      <div class="tip__article--hasresults" v-if="isPreviewToBeVisualized(tip)">
        <img v-bind:src="tip.preview.image" class="mr-2">
        <span>
          {{tip.preview.description}}
        </span>
      </div>
      <div class="tip__article--noresults" v-else>
        {{$t('pages.system.noPreview')}}
      </div>
    </div>
  </div>
</template>

<script>
  import Backend from "../../utils/backend";
  import CommentModal from "../CommentModalComponent.vue"
  import { wallet } from '../../utils/walletSearch';
  import aeternity from '../../utils/aeternity';
  import * as helper from '../../utils/helper';

  const backendInstance = new Backend();

  export default {
    name: 'TipRecord',
    props: ['tip', 'foundWallet', 'retip', 'defaultCurrency', 'fiatValue', 'senderLink'],
    data() {
      return {
      }
    },
    methods: {
      isPreviewToBeVisualized(tip){
       return typeof tip !== 'undeifned' && tip !== null
        && typeof tip.preview !== 'undefined' && tip.preview.description !== null
          && tip.preview.description.length > 0  && tip.preview.image !== null;
      },
      goToTip(tip){
        this.$router.push({name: 'tip-comments',
        params: { tipData: tip }
        })
      },
      sendComment(data){
        
        let postData = {
          tipId: data.tip.tipId,
          text: data.comment,
          hidden: false,
          author: wallet.client.rpcClient.getCurrentAccount(),
        }

        console.log("sending comment => ", postData)
        
        backendInstance.sendTipComment(postData).then(async (response) => {
          console.log("challenge => ", response.challenge);
          console.log("signing with => ", wallet.client.rpcClient.getCurrentAccount())
         
          let signedChallenge = await helper.signMessage(response.challenge)
          let respondChallenge = {
            challenge: response.challenge,
            signature: signedChallenge
          }

          backendInstance.sendTipComment(respondChallenge).then((result) => {
            console.log(result);
            this.$emit('updateComment', result)
          }).catch(console.error)
        }).catch(console.error);
      }
    },
    components: {
      'comment-modal': CommentModal,
    },
    created(){

    }
  }
</script>

<style lang="scss" >
 @import "../../styles/base";

  .tip__record.row.row{
    margin-left: 0;
    margin-right: 0;
  }
  .tip__record{
      background-color: $light_color;
      border-radius: .25rem;
      padding: .5rem 0 0 0;
      margin: 0 0 1rem 0;
      .tip__body{
        width: 100%;
        padding-left: 0;
        .tip__note{
          font-size: .8375rem;
          color: $standard_font_color;
          height: 2.75rem;
          overflow-y: auto;
          padding-left: 1rem;
          &:hover{
            cursor: pointer;
          }
        }
        .tip__url{
          color: $custom_links_color;
          font-size: .6rem;
          cursor: pointer;
          display: block;
          padding-left: 1rem;
        }
        .tip__footer{
          background-color: $light_color;
          font-size: .55rem;
          color: $light_font_color;
          border-bottom-right-radius: .25rem;
          border-bottom-left-radius: .25rem;
          border-top: .05rem solid $record_footer_border_color;
          margin-left: 1rem;
          padding: .5rem 1rem .5rem 0;
          .tip__amount{
            span{
              color: $secondary_color;
            }
            &:hover{
              cursor: pointer;
            }
          }
          .tip__sender{
            color: $custom_links_color;
            span{
              color: $light_font_color;
            }
            a,.tip__sender{
              color: $custom_links_color;
            }
          }
          .tip__date{
            text-align: right;
            span{
              margin-right: -1rem;
            }
          }
          .tip__totalsum, .tip__amount, .tip__comments, .tip__article__logo{
            img {
              width: .75rem;
              display: inline;
              margin-right: 2px;
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
        min-height: 5.9rem;
        font-size: .6rem;
        position: relative;
        color: $standard_font_color;
        background-color: $thumbnail_background_color;
        padding-top: .5rem;
        padding-left: .5rem;
        margin-top: -.5rem;
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
        img{
          width: 6rem;
          float: left;
          height: 4.125rem;
          border-radius: .25rem;
          top: 50%;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(20%);
        }
        span{
          @include truncate-overflow-mx(6);
        }
        .tip__article--noresults{
          display: none;
          width: 100%;
          text-align: center;
          @include vertical-align(absolute);
          font-size: .75rem;
          color: $light_font_color;
          left: 0;
        }
      }
    }
  .tip__date--mobile{
    display: none;
  }
  .tips__container .tip__record .tip__body{
      width: 100%;
  }

@media only screen and (min-width: 1024px){
  .tip__record{
    position: relative;
    padding-bottom: 2.85rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2.85rem;
    }
    .tip__article{
      min-height: initial;
      padding-bottom: .5rem;
      padding-left: 1rem;
      min-height: 2rem;
      &.col-4{
        width: 100%;
        max-width: 100%;
        flex: initial;
      }
      img{
        transform: none;
      }
      span{
        @include truncate-overflow-mx(4);
      }
    }
    .tip__body{
      &.col-8{
        position: static;
        width: 100%;
        max-width: 100%;
        flex: initial;
      }
      .tip__note{
        height: initial
      }
      .tip__url{
        padding-bottom: .5rem;
      }
      .tip__footer{
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 0;
        z-index: 1;
        margin-left: 0;
        margin-right: 1rem;
        font-size: .6rem;
        .tip__date{
          text-align: left;
        }
      }
    }
  }
}

@media only screen and (max-width: 1024px){
  .tip__record{
    position: relative;
    padding-bottom: 2.85rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2.85rem;
    }
    .tip__article{
      min-height: initial;
      padding-bottom: .5rem;
      padding-left: 1rem;
      min-height: 2rem;
      &.col-4{
        width: 100%;
        max-width: 100%;
        flex: initial;
      }
      img{
        transform: none;
      }
      span{
        @include truncate-overflow-mx(4);
      }
    }
    .tip__body{
      &.col-8{
        position: static;
        width: 100%;
        max-width: 100%;
        flex: initial;
      }
      .tip__note{
        height: initial
      }
      .tip__url{
        padding-bottom: .5rem;
      }
      .tip__footer{
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 0;
        z-index: 1;
        margin-left: 0;
        margin-right: 1rem;
        font-size: .6rem;
        .tip__date{
          text-align: left;
        }
      }
    }
  }
}

@media only screen and (max-width: 1024px) and (min-width: 992px){
   .tips__container .tip__record{
    padding-bottom: 2rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2rem;
    }
  }
}
@media only screen and (max-width: 768px){
  .tip__record{
    padding-bottom: 3.35rem;
    .tip__body.col-12 .tip__footer{
      bottom: -3.35rem;
    }
    .tip__body{
      .tip__note{
        font-size: .75rem;
      }
      .tip__footer{
        font-size: .5rem;
        .col-lg-9.col-md-12{
          padding-right: 0;
        }
        .tip__sender{
            display: block;
        }
      }
    }
  }
}
@media only screen and (max-width: 600px) {
   .tips__container .tip__record .tip__body .tip__note{
    font-size: .65rem;
  }
  .tips__container .tip__record .tip__actions .btn-sm img{
    width: .75rem
  }
  .tips__container .tip__record .tip__body .tip__footer .tip__amount img{
    width: .7rem;
  }
  .tips__container .tip__record .tip__body .tip__footer{
    white-space: normal;
  }
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .tip__date--mobile{
    color: $light_font_color;
    display: block;
    position: absolute;
    font-size: .65rem;
    top: .25rem;
  }
   .tip__record{
        position: relative;
        padding: 1.25rem .5rem 3.85rem .5rem;
        margin-bottom: .5rem;
        .tip__article{
          margin-left: -.5rem;
          padding-left: .5rem;
          max-width: calc(100% + 1rem);
          width: calc(100% + 1rem);
          margin-right: -1rem;
        }
        .tip__body{
          .tip__note,.tip__url{
            padding-left: 0;
          }

          .tip__footer{
            margin-left: -.5rem;
            margin-right: .5rem;
            padding: .5rem 0 .5rem 0;
            font-size: .65rem;
            .row{
              margin-left: 0;
              margin-right: 0;
              .col-lg-9.col-md-12{
                padding-left: 0;
              }
            }
            .tip__sender{
              font-size: .44rem;;
            }
            .tip__amount{
              padding-bottom: .25rem;
              display: block;
              img {
                width: 1rem;
              }
            }
            .tip__date{
              display: none;
            }
        }
      }
    }
  .container.wrapper .tips__container .tip__record  .tip__body.col-12 .tip__footer{
    margin-left: -1rem;
    margin-right: 0;
  }
  .tipped__url .tip__record  .tip__body.col-12 .tip__footer{
    bottom: -3.85rem;
    left: .5rem;
    margin-right: 0;
  }
}
</style>