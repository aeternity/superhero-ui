<template>
  <div  class="tip__record row">
    <div class="tip__body " v-bind:class="[ isPreviewToBeVisualized(tip)? 'col-8' : 'col-12']">
      <div class="clearfix">
        <div class="tip__author" :title="tip.sender">
          <img src="../../assets/userAvatar.svg">
          <a v-if="senderLink" :href="senderLink" target="_blank">{{ tip.sender }}</a>
          <span class="tip__author" v-else> {{ tip.sender }}</span>
          <span class="date">
            {{ new Date(tip.timestamp).toLocaleString('en-US', { hourCycle: 'h24' }) }}
          </span>
        </div>
        <div class="tip__note pr-2" :title="tip.title" @click="goToTip(tip.id)">
            {{ tip.title }}
        </div>
      </div>
      <div>
        <a class="tip__url mb-2 text-ellipsis pr-2" :title="tip.url" :href='tip.url' target="_blank">{{tip.url}}</a>
      </div>
      <div class="tip__footer text-ellipsis">
        <div class="row">
          <div class="col-lg-9 col-md-12">
            <span class="tip__amount" @click="retip(tip.id)" title="Send AE to this post">
              <img src="../../assets/heart.svg"> {{ tip.total_amount }} <span>AE</span>
            </span>
            <fiat-value :amount="tip.total_amount"></fiat-value>
            <span @click="goToTip(tip.id)"><img src="../../assets/commentsIcon.svg"></span>
          </div>
          <div class="col-lg-3 col-md-12" >
          </div>
        </div>
      </div>
    </div>
    <div class="tip__article col-4" v-if="isPreviewToBeVisualized(tip)">
      <div class="tip__article--hasresults" v-if="isPreviewToBeVisualized(tip)">
        <img v-bind:src="tip.preview.image" class="mr-2">
        <span>
          {{tipText}}
        </span>
      </div>
      <div class="tip__article--noresults" v-else>
        {{$t('pages.system.noPreview')}}
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import aeternity from '../../utils/aeternity';
  import FiatValueComponentVue from '../FiatValueComponent.vue';
  import util from '../../utils/util';
  import {EventBus} from '../../utils/eventBus';

  export default {
    name: 'TipRecord',
    props: ['tip', 'foundWallet', 'fiatValue', 'senderLink'],
    components: {
      'fiat-value': FiatValueComponentVue
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters(['current']),
      tipText() {
        if(!this.isPreviewToBeVisualized(this.tip)) return '';
        return this.tip.preview.description ? this.tip.preview.description : this.tip.preview.title;
      }
    },
    methods: {
      async retip(id) {
        const amount = util.aeToAtoms(prompt("Tip Amount in AE?"));
        await aeternity.contract.methods.retip(id, {amount: amount}).catch(console.error);
        EventBus.$emit('reloadData');
      },
      isPreviewToBeVisualized(tip) {
        return typeof tip !== 'undefined' && tip !== null
          && typeof tip.preview !== 'undefined' && tip.preview.image !== null
          && (
            (tip.preview.description !== null && tip.preview.description.length > 0) ||
            (tip.preview.title !== null && tip.preview.title.length > 0)
          )
      },
      goToTip(id) {
        console.log("goToTip", id);
        this.$router.push({
          name: 'tip',
          params: {
            id: id
          }
        })
      },
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
      padding: .5rem 0 0 0;
      margin: 0 0 0.3rem 0;
      .tip__body{
        width: 100%;
        padding-left: 0;
        .tip__author{
          color: $light_font_color;
          font-size: .6rem;
          padding: .25rem 1rem .25rem 1rem;
          img{
            width: 1.2rem;
            margin-right: 0.25rem;
          }
          a{
            color: $light_font_color;
          }
        }
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
        color: $article_description_color;
        background-color: $thumbnail_background_color;
        padding: 0;
        margin-left: 1rem;
        margin-right: 1rem;
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
        img{
          width: 50%;
          float: left;
          height: 7.5rem;
          border-radius: .25rem;
          top: 50%;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(20%);
          object-fit: cover;
        }
        span{
          padding: .5rem 0.1rem 0 0.5rem;
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
    padding-bottom: 2rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2rem;
    }
    .tip__article{
      min-height: initial;
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
        @include truncate-overflow-mx(6);
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
    padding-bottom: 2rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2rem;
    }
    .tip__article{
      min-height: initial;
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
        @include truncate-overflow-mx(6);
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
    padding-bottom: 2rem;
    .tip__body.col-12 .tip__footer{
      bottom: -2rem;
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
        padding: .5rem .5rem 2rem .5rem;
        margin-bottom: .5rem;
        .tip__article{
          margin-left: -.5rem;
          padding-left: .5rem;
          max-width: calc(100% + 1rem);
          width: calc(100% + 1rem);
          margin-right: -1rem;
        }
        .tip__body{
          .tip__author{
            padding-left: 0;
            font-size: .5rem;
          }
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
    bottom: -2rem;
    left: .5rem;
    margin-right: 0;
  }
}
</style>
