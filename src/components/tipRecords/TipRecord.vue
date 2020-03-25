<template>
  <div @click="goToTip(tip.id)" class="tip__record row">
    <div class="tip__body">
      <div class="tip__description">
        <div class="tip__author" :title="tip.sender" @click.stop>
          <router-link :to="'/user-profile/' + tip.sender">
            <img :src="getAvatar(tip.sender)">
            <div class="tip__author_name">
              <span v-if="tip.chainName" class="chain__name">{{ tip.chainName }}</span>
              <span v-else class="chain__name"></span>
              <span class="address">{{ tip.sender }}</span>
            </div>
          </router-link>
          <span class="tip__date">
            <format-date :dateTimestamp="tip.timestamp"></format-date>
          </span>
        </div>
        <div class="tip__note pr-2" @click.stop>
          <tip-title :tip="tip" :goToTip="goToTip"></tip-title>
        </div>
      </div>
      <div class="tip__article" v-if="isPreviewToBeVisualized(tip)">
        <a :href="tip.url" target="_blank" @click.stop>
          <div class="tip__article--hasresults">
            <img :src="tipPreviewImage" :onerror="`this.className='fail'`" :loading="`lazy`">
            <div class="tip__article__content">
              <h2
                class="title text-ellipsis"
                :title="tipPreviewTitle">
                {{ tipPreviewTitle }}
              </h2>
              <div
                class="description"
                :title="tipPreviewDescription">
                {{ tipPreviewDescription }}
              </div>
              <div
                class="domain text-ellipsis"
                :title="tipPreviewDomain">
                {{ tipPreviewDomain }}
              </div>
            </div>
          </div>
        </a>
      </div>
      <div class="tip__footer">
        <div class="tip__footer_wrapper">
          <div class="tip__amount" title="Send AE to the same url" @click.stop>
            <retip
              :tipid="tip.id"
              :tipurl="tip.url"
              :amount="tip.amount_ae"
            />
          </div>
          <div class="retip__amount" title="Send AE to this post" @click.stop>
            <retip
              :tipid="tip.id"
              :show-retip-icon="true"
              :amount="tip.retip_amount_ae"
            />
          </div>
          <div class="tip__comments" @click="goToTip(tip.id)">
            <img src="../../assets/commentsIcon.svg">
            <span>{{ tip.commentCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '../../assets/userAvatar.svg';
import Backend from '../../utils/backend';
import Retip from '../Retip.vue';
import FormatDate from './FormatDate.vue';
import TipTitle from './TipTitle.vue';

export default {
  name: 'TipRecord',
  props: ['tip', 'foundWallet', 'senderLink'],
  data() {
    return {
      defaultAvatar,
    };
  },
  components: {
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
    getAvatar(address) {
      const userImage = Backend.getProfileImageUrl(address);
      return userImage || this.defaultAvatar;
    },
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
  .tip__record {
    background-color: $light_color;
    margin: 0 0 0.15rem 0;

    &:hover {
      cursor: pointer;
    }
  }

  .tip__body {
    padding-top: 1rem;
    width: 100%;
  }

  .tip__author {
    align-items: center;
    color: $light_font_color;
    display: flex;
    font-size: .8rem;
    padding: 0 1rem .5rem 1rem;

    .tip__date {
      display: inline-block;
      font-size: .6rem;
      text-align: right;
      width: 10%;
    }

    .address {
      font-size: .6rem;
    }

    .address, .chain__name {
      display: inline-block;
      width: calc(100% - 2rem);
      word-break: break-all;
    }

    img {
      border-radius: 50%;
      flex-shrink: 0;
      height: 2rem;
      margin-right: 0.25rem;
      object-fit: cover;
      width: 2rem;
    }

    & > a {
      color: $light_font_color;
      display: flex;
      width: 90%;

      &:hover {
        filter: brightness(1.3);
      }
    }

    .chain__name {
      color: #fff;
    }

    .tip__author_name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
    }
  }

  .tip__note {
    color: $tip_note_color;
    font-size: .8rem;;
    margin-bottom: .5rem;
    padding-left: 1rem;

    .title .topic {
      color: $standard_font_color;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .tip__footer {
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
    color: $light_font_color;
    font-size: .8rem;
    padding: 0 1rem 1rem;

    .currency-value,
    .ae-amount {
      align-items: center;
      display: flex;
      height: 1rem;
    }

    .ae-amount {
      color: #fff;
    }

    .ae {
      color: $secondary_color;
    }
  }

  .tip__footer_wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  // separator
  .tip__footer_wrapper:after {
    content: '';
    flex-basis: 1rem;
    height: 1rem;
    order: 3;
  }

  .tip__comments {
    cursor: pointer;
    order: 4;
  }

  .tip__comments,
  .retip__amount,
  .tip__amount {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 1rem;
    margin-right: 1rem;
    margin-top: .9rem;
    position: relative;


    img {
      height: 1rem;
      margin-right: .2rem;
      vertical-align: top;
      width: 1rem;
    }

    &:hover img {
      filter: brightness(1.3);
    }

    .tip__amount__btn {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .tip__sender {
    color: $custom_links_color;

    span {
      color: $light_font_color;
    }

    a, .tip__sender {
      color: $custom_links_color;
    }
  }

  .tip__article {
    background-color: $thumbnail_background_color;
    background-image: url("../../assets/defaultImg.svg");
    background-position: 14% center;
    background-repeat: no-repeat;
    background-size: 30%;
    border-radius: .5rem;
    font-size: .75rem;
    height: 9rem;
    margin-left: 1rem;
    margin-right: 1rem;
    min-height: 5.9rem;
    overflow: hidden;
    padding: 0;
    position: relative;

    .tip__article--hasresults {
      display: flex;

      img {
        flex-basis: 50%;
      }

      .tip__article__content {
        flex-basis: 50%;
        width: 50%;
      }
    }

    img {
      background-color: $thumbnail_background_color;
      float: left;
      height: 9rem;
      object-fit: cover;
      width: 50%;
    }

    .tip__article__content {
      color: #babac0;
      height: 9rem;
      line-height: 1.1rem;
      padding: .7rem 1rem;

      .title {
        display: block;
        font-size: .75rem;
        font-weight: 700;
        margin-bottom: .25rem;
      }

      .description {
        @include truncate-overflow-mx(5);
        margin-bottom: .25rem;
      }
    }

    &:hover {
      background-color: #32343e;
      cursor: pointer;

      img {
        background-color: #32343e;
      }

      .domain {
        text-decoration: underline;
      }

      .tip__article__content {
        color: #c6c6cc;
      }
    }
  }

  .tip__note {
    @include truncate-overflow-mx(4);
  }

  @media only screen and (max-width: 768px) {
    .tip__record {
      .tip__body {
        .tip__note {
          font-size: .75rem;
        }

        .tip__footer {
          .col-lg-9.col-md-12 {
            padding-right: 0;
          }

          .tip__sender {
            display: block;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .tip__record {
      position: relative;

      .tip__article {
        min-height: 2rem;
      }

      .tip__body {
        .tip__note {
          height: initial
        }
      }
    }
  }

  @media only screen and (max-width: 600px) {
    .tips__container .tip__record .tip__body .tip__note {
      font-size: .65rem;
    }
    .tips__container .tip__record .tip__actions .btn-sm img {
      width: .75rem
    }
    .tips__container .tip__record .tip__body .tip__footer .tip__amount img {
      width: .7rem;
    }
  }

  //Smallest devices Portrait and Landscape
  @media only screen and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
    .tip__body {
      padding: 0;
    }
    .tip__record {
      margin-bottom: .5rem;
      padding: .5rem .5rem .5rem .5rem;
      position: relative;
    }

    .tip__article {
      margin-left: -.5rem;
      margin-right: -1rem;
      max-width: calc(100% + 1rem);
      width: calc(100% + 1rem);
    }

    .tip__author {
      font-size: .6rem;
      padding-left: 0;
      padding-right: 0;

      img {
        height: 1.5rem;
        width: 1.5rem;
      }

      .date {
        width: 20%;
      }

      & > a {
        width: 80%
      }

      .address {
        font-size: .32rem;
      }
    }

    .tip__note {
      padding: 0;
    }

    .tip__footer {
      font-size: .65rem;
      padding: .5rem 0 .5rem 0;

      .row {
        margin-left: 0;
        margin-right: 0;

        .col-lg-9.col-md-12 {
          padding-left: 0;
        }
      }

      .tip__sender {
        font-size: .44rem;;
      }

      .tip__amount {
        img {
          width: 1rem;
        }
      }
    }

    .tip__article {
      margin-left: 0;
      width: 100%;

      .tip__article__content {
        line-height: 1.1rem;

        .description {
          @include truncate-overflow-mx(5);
        }
      }
    }
  }
</style>
