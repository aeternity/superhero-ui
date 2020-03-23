<template>
  <div @click="goToTip(tip.id)" class="tip__record row">
    <div class="tip__body ">
      <div class="clearfix">
        <div class="tip__author" :title="tip.sender" v-on:click.stop>
          <router-link :to="'/user-profile/' + tip.sender">
            <img src="../../assets/userAvatar.svg">
            <span v-if="tip.chainName" class="chain__name">{{tip.chainName}}</span>
            <span v-else class="address">{{tip.sender}}</span>
          </router-link>
          <span class="date" v-bind:class="[tip.chainName ? '': 'wholeaddr']">
            <format-date :dateTimestamp="tip.timestamp"></format-date>
          </span>
        </div>
        <div class="tip__note pr-2" v-on:click.stop>
          <tip-title :tip="tip" :goToTip="goToTip"></tip-title>
        </div>
      </div>
      <div class="tip__article position-relative" v-if="isPreviewToBeVisualized(tip)">
        <a :href="tip.url" target="_blank" v-on:click.stop>
        <div class="tip__article--hasresults">
          <img :src="tipPreviewImage" :onerror="`this.style.opacity=0`">
          <div class="tip__article__content">
            <h2 class="title text-ellipsis"
              :title="tipPreviewTitle">
              {{tipPreviewTitle}}
            </h2>
            <div class="description"
              :title="tipPreviewDescription">
              {{tipPreviewDescription}}
            </div>
            <div class="domain text-ellipsis"
              :title="tipPreviewDomain">
              {{tipPreviewDomain}}
            </div>
          </div>
        </div>
        </a>
      </div>
      <div class="tip__footer">
        <div class="row">
          <div class="col-md-12">
            <span class="tip__amount position-relative" >
              <span class="tip__amount__btn" v-on:click.stop title="Send AE to this post">
                <retip :tipid="tip.id" />
              </span>
              <ae-amount :amount="tip.amount_ae" :round="2"></ae-amount>
            </span>
            <fiat-value :amount="tip.amount_ae"></fiat-value>
            <span class="ml-4 retip__wrapper" v-on:click.stop>
              <retip :tipid="tip.id" :show-retip-icon="true"/>
              <ae-amount :amount="tip.retip_amount_ae" :round="2"></ae-amount>
              <fiat-value :amount="tip.retip_amount_ae"></fiat-value>
            </span>
            <span @click="goToTip(tip.id)" class="ml-4">
              <img src="../../assets/commentsIcon.svg">
            </span>
            <span>{{tip.commentCount}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FiatValue from '../FiatValue.vue';
import AeAmount from '../AeAmount.vue';
import Retip from '../Retip.vue';
import TipTitle from './TipTitle.vue';
import Backend from '../../utils/backend';
import FormatDate from './FormatDate.vue';

export default {
  name: 'TipRecord',
  props: ['tip', 'foundWallet', 'senderLink'],
  components: {
    FiatValue,
    AeAmount,
    Retip,
    TipTitle,
    FormatDate,
  },
  computed: {
    tipPreviewDescription() {
      if (!this.isPreviewToBeVisualized(this.tip)) return '';

      return this.tip.preview.description ? this.tip.preview.description : '';
    },
    tipPreviewTitle() {
      if (!this.isPreviewToBeVisualized(this.tip)) return '';

      return this.tip.preview.title ? this.tip.preview.title : '';
    },
    tipPreviewDomain() {
      if (!this.isPreviewToBeVisualized(this.tip)) return '';

      return this.tip.preview.responseUrl ? new URL(this.tip.preview.responseUrl).hostname : '';
    },
    tipPreviewImage() {
      return this.isPreviewToBeVisualized(this.tip) && this.tip.preview.image !== null ? Backend.getTipPreviewUrl(this.tip.preview.image) : '';
    },
  },
  methods: {
    isPreviewToBeVisualized(tip) {
      return typeof tip !== 'undefined' && tip !== null
          && typeof tip.preview !== 'undefined'
          && (
            (tip.preview.description !== null && tip.preview.description.length > 0)
            || (tip.preview.title !== null && tip.preview.title.length > 0)
          );
    },
    goToTip(id) {
      this.$router.push({
        name: 'tip',
        params: {
          id,
        },
      });
    },
  },
};
</script>

<style lang="scss">
  .tip__record.row.row{
    margin-left: 0;
    margin-right: 0;
    &:hover{
      cursor: pointer;
    }
  }
  .url__page .tip__record .tip__body .tip__footer{
    background-color: $actions_ribbon_background_color;
  }
  .tip__record{
      background-color: $light_color;
      padding: 1rem 0 0 0;
      margin: 0 0 0.15rem 0;
      .tip__body{
        width: 100%;
        padding-left: 0;
        .tip__author{
          color: $light_font_color;
          font-size: .8rem;
          padding: .25rem 1rem .25rem 1rem;
          display: flex;
          .date{
            width: 10%;
            font-size: .6rem;
            display: inline-block;
            padding-top: .2rem;
            text-align: right;
          }
          .address{
            font-size: .6rem;
          }
          .address, .chain__name{
            width: calc(100% - 2rem);
            display: inline-block;
            word-break: break-all;
          }
          img{
            width: 1.5rem;
            margin-right: 0.25rem;
          }
          &>a{
            width: 90%;
            color: $light_font_color;
            &:hover{
              text-decoration: none;
            }
          }
        }
        .tip__note{
          font-size: .8rem;;
          color: $tip_note_color;
          padding-left: 1rem;
          margin-bottom: .5rem;
          &:hover{
            cursor: pointer;
          }
          .title .topic{
            color: $standard_font_color;
          }
        }
        .tip__footer{
          background-color: $light_color;
          font-size: .8rem;
          color: $light_font_color;
          border-bottom-right-radius: .25rem;
          border-bottom-left-radius: .25rem;
          margin-left: 1rem;
          padding: .9rem 1rem .9rem 0;
          .ae{
            color: $secondary_color;
          }
          .tip__amount{
            .tip__amount__btn{
              &:hover{
                cursor: pointer;
              }
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
          .tip__amount, .tip__comments{
            img {
              width: 1rem;
              display: inline;
              margin-right: 2px;
            }
          }
        }
        .tip__article{
          min-height: 5.9rem;
          font-size: .75rem;
          position: relative;
          background-color: $thumbnail_background_color;
          padding: 0;
          margin-left: 1rem;
          border-radius: .5rem;
          margin-right: 1rem;
          background-image: url("../../assets/defaultImg.svg");
          background-position: 1rem center;
          background-repeat: no-repeat;
          overflow: hidden;
          height: 9rem;

          &:hover{
            cursor: pointer;
          }
          img{
            background-color: $thumbnail_background_color;
            width: 50%;
            float: left;
            object-fit: cover;
            margin-right: .5rem;
            height: 9rem;
          }
          .tip__article__content{
            width: 50%;
            color: $tip_note_color;
            padding: .5rem 0.1rem 0 0.5rem;
            height: 9rem;
            line-height: 1.1rem;
            .title{
              display: block;
              font-size: .75rem;
              font-weight: 700;
              margin-bottom: .25rem;
            }
            .description{
              @include truncate-overflow-mx(5);
              margin-bottom: .25rem;
            }
          }
          .tip__article--hasresults{
            padding-right: .5rem;
            display: flex;
          }
        }
      }
    }
  .tips__container .tip__record .tip__body{
      width: 100%;
    .tip__note{
      @include truncate-overflow-mx(4);
    }
  }

@media only screen and (max-width: 1024px){
  .tip__record{
    position: relative;
    .tip__article{
      min-height: 2rem;
    }
    .tip__body{
      .tip__note{
        height: initial
      }
      .tip__footer{
        margin-left: 1rem;
      }
    }
  }
}

@media only screen and (max-width: 768px){
  .tip__record{
    .tip__body{
      .tip__note{
        font-size: .75rem;
      }
      .tip__footer{
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

  .tip__record .tip__article {
      background-size: 8rem;
  }
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
   .tip__record{
        position: relative;
        padding: .5rem .5rem .5rem .5rem;
        margin-bottom: .5rem;
        .tip__article{
          margin-left: -.5rem;
          padding-left: .5rem;
          max-width: calc(100% + 1rem);
          width: calc(100% + 1rem);
          margin-right: -1rem;
          background-size: 5rem;
        }
        .tip__body{
          .tip__author{
            padding-left: 0;
            padding-right: 0;
            font-size: .6rem;
            img{
              vertical-align: middle;
            }
            .date{
              width: 20%;
                padding-top: .3rem;
            }
            &>a{
              width: 80%
            }
            .address{
              font-size: .32rem;
            }
          }
          .tip__note{
            padding-left: 0;
          }

          .tip__footer{
            margin-left: -.5rem;
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
              img {
                width: 1rem;
              }
            }
        }
        .tip__article{
          margin-left: 0;
          width: 100%;
          .tip__article__content {
            .description {
              @include truncate-overflow-mx(5);
            }
            line-height: 1.1rem;
          }
        }
      }
    }
  .container.wrapper .tips__container .tip__record  .tip__body.col-12 .tip__footer{
    margin-left: -1rem;
    margin-right: 0;
  }
  .tipped__url .tip__record  .tip__body.col-12 .tip__footer{
    margin-right: 0;
  }
}
</style>
