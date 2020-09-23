<template>
  <div
    class="tip__record row"
    @click="goToTip"
  >
    <div class="tip__body">
      <div class="tip__description">
        <AuthorAndDate
          :date="new Date(tip.timestamp)"
          :address="tip.sender"
          :name="tip.chainName"
        >
          <ThreeDotsMenu v-if="address">
            <div @click="sendReport">
              {{ $t('components.tipRecords.TipRecord.reportPost') }}
            </div>
            <div @click="claim">
              {{ $t('components.tipRecords.TipRecord.claim') }}
            </div>
            <div @click="pinOrUnPinTip">
              {{
                isTipPinned ?
                  $t('components.tipRecords.TipRecord.UnPin')
                  : $t('components.tipRecords.TipRecord.Pin')
              }}
            </div>
          </ThreeDotsMenu>
        </AuthorAndDate>
      </div>
      <div
        class="tip__note pr-2"
        @click.stop
      >
        <TipTitle :tip-title="tip.title" />
      </div>
      <TipRichPreview
        v-if="isRichPreview(tip)"
        :tip="tip"
        :tip-preview-title="tipPreviewTitle"
        :tip-preview-description="tipPreviewDescription"
        :tip-preview-image="tipPreviewImage"
        :go-to-tip="goToTip"
      />
      <div
        v-else-if="isPreviewToBeVisualized(tip)"
        class="tip__article"
      >
        <div class="tip__article--hasresults">
          <div class="tip__article__content">
            <h2
              class="title text-ellipsis"
              :title="tipPreviewTitle"
            >
              {{ tipPreviewTitle }}
            </h2>
            <div
              class="description"
              :title="tipPreviewDescription"
            >
              {{ tipPreviewDescription }}
            </div>
            <div
              class="site__url"
              :title="tip.url"
            >
              <a
                class="text-ellipsis"
                target="_blank"
                :href="tip.url"
                @click.stop
              >
                <ExternalLink />
                <span class="text-ellipsis">{{ tip.url }}</span>
              </a>
            </div>
            <div
              class="tip__amount"
              @click.stop
            >
              <TipInput :tip="tip" />
            </div>
          </div>
          <img
            :src="tipPreviewImage"
            :onerror="`this.className+=' fail'`"
            :loading="`lazy`"
            class="preview__image"
          >
        </div>
      </div>
      <div v-else>
        <template v-if="tip.url">
          <a
            :href="tip.url"
            :title="tip.url"
            class="text-ellipsis"
            target="_blank"
            @click.stop
          >
            {{ tip.url }}
          </a>
        </template>
        <div
          v-if="tip.receiver"
          class="tip__author"
          :title="tip.receiver"
          @click.stop
        >
          <TipInput :tip="tip" />
          <RouterLink :to="{ name: 'user-profile', params: { address: tip.receiver } }">
            <Avatar :address="tip.receiver" />
            <div class="tip__author_name">
              <span class="chain__name">
                {{ tip.chainName }}
              </span>
              <span class="address">{{ tip.receiver }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="tip__footer">
        <div class="tip__footer_wrapper">
          <div
            class="tip__comments"
            :class="[{ 'tip__comments--hascomments': tip.commentCount }]"
          >
            <img
              class="comment__icon"
              src="../../assets/commentsIcon.svg"
            >
            <span>{{ tip.commentCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../../utils/backend';
import backendAuthMixin from '../../utils/backendAuthMixin';
import TipInput from '../TipInput.vue';
import TipTitle from './TipTitle.vue';
import TipRichPreview from './TipRichPreview.vue';
import ThreeDotsMenu from '../ThreeDotsMenu.vue';
import AuthorAndDate from './AuthorAndDate.vue';
import ExternalLink from '../../assets/externalLink.svg?icon-component';

export default {
  components: {
    TipTitle,
    TipRichPreview,
    TipInput,
    ThreeDotsMenu,
    ExternalLink,
    AuthorAndDate,
  },
  mixins: [backendAuthMixin(true)],
  props: {
    tip: { type: Object, required: true },
  },
  computed: {
    ...mapState(['address', 'useSdkWallet']),
    ...mapState({
      isTipPinned({ pinnedItems }) {
        return pinnedItems.some(({ id }) => id === this.tip.id);
      },
    }),
    tipPreviewDescription() {
      if (!this.isPreviewToBeVisualized(this.tip)) return '';

      return this.tip.preview.description ? this.tip.preview.description : '';
    },
    tipPreviewTitle() {
      if (!this.isPreviewToBeVisualized(this.tip)) return '';

      return this.tip.preview.title ? this.tip.preview.title : '';
    },
    tipPreviewImage() {
      return this.isPreviewToBeVisualized(this.tip) && this.tip.preview.image !== null ? Backend.getTipPreviewUrl(this.tip.preview.image) : '';
    },
    toTip() {
      return { name: 'tip', params: { tipId: this.tip.id } };
    },
  },
  methods: {
    async sendReport() {
      await this.backendAuth('sendPostReport', { tipId: this.tip.id }, this.toTip);
      if (this.useSdkWallet) {
        await this.$store.dispatch('modals/open', {
          name: 'success',
          title: this.$t('components.tipRecords.TipRecord.reportPostTitle'),
          body: this.$t('components.tipRecords.TipRecord.reportPostBody'),
        });
      }
    },
    async claim() {
      try {
        await Backend.claimFromUrl({
          url: this.tip.url,
          address: this.address,
        });
        this.$store.dispatch('modals/open', {
          name: 'success',
          title: this.$t('components.tipRecords.TipRecord.claimTitle'),
          body: this.$t('components.tipRecords.TipRecord.claimBodySuccess'),
        });
      } catch (e) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: this.$t('components.tipRecords.TipRecord.claimTitle'),
          body: this.$t('components.tipRecords.TipRecord.claimBodyFailure'),
        });
      }
    },
    async pinOrUnPinTip() {
      await this.backendAuth(
        this.isTipPinned ? 'unPinItem' : 'pinItem',
        { entryId: this.tip.id, type: 'TIP' },
        this.toTip,
      );
      await this.$store.dispatch('updatePinnedItems');
    },
    isRichPreview(tip) {
      const youTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch.+$/;
      const twitterRegex = /^(https?:\/\/)?(www\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
      const soundCloudRegex = /^(https?:\/\/)?(www\.)?soundcloud\.com\//;
      return [youTubeRegex, twitterRegex, soundCloudRegex].filter((r) => r.test(tip.url)).length > 0;
    },
    isPreviewToBeVisualized(tip) {
      return typeof tip !== 'undefined' && tip !== null
        && typeof tip.preview !== 'undefined'
        && (
          (tip.preview.description !== null && tip.preview.description.length > 0)
          || (tip.preview.title !== null && tip.preview.title.length > 0)
        );
    },
    goToTip() {
      return this.$route.params.tipId === this.tip.id
        ? window.open(this.tip.url)
        : this.$router.push(this.toTip);
    },
  },
};
</script>

<style lang="scss" scoped>
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
    font-size: 0.8rem;
    justify-content: space-between;
    padding: 0 1rem 0.9rem 1rem;

    .tip__date {
      font-size: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .three-dots {
        font-size: 0.75rem;
        margin-left: 0.3rem;
      }
    }

    .address {
      font-size: 0.65rem;
    }

    .address,
    .chain__name {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      word-break: break-all;
    }

    img.user-identicon,
    img.preview__image,
    svg {
      border-radius: 50%;
      flex-shrink: 0;
      height: 2rem;
      margin-right: 0.25rem;
      object-fit: cover;
      width: 2rem;
    }

    a {
      color: $light_font_color;
      display: flex;
      margin-right: 1rem;
      overflow: hidden;

      &:hover {
        filter: brightness(1.3);
      }
    }

    .chain__name {
      color: #fff;
    }

    .tip__description .author-and-date .date .three-dots {
      font-size: 0.75rem;
      margin-left: 0.3rem;
    }
  }

  .tip-title {
    @include truncate-overflow-mx(4);

    color: $tip_note_color;
    font-size: 0.85rem;
    line-height: 1.1rem;
    margin-bottom: 0.8rem;
    padding-left: 1rem;
    padding-right: 0.5rem;
  }

  .retip__icon {
    height: 1rem;
    margin-right: 0.2rem;
    vertical-align: top;
    padding: 0.1rem 0;
    width: 1rem;
  }

  .comment__icon {
    margin-right: 0.2rem;
    vertical-align: top;
  }

  .tip__footer {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    color: $light_font_color;
    font-size: 0.8rem;
    padding: 1.4rem 1rem 0.75rem;
  }

  .tip__footer_wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tip__comments,
  .tip__amount {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 1rem;
    cursor: pointer;
    position: relative;
    width: max-content;

    &.tip__comments--hascomments {
      color: #fff;
    }
  }

  .tip__comments:hover img {
    filter: brightness(1.3);
  }

  .tip__url {
    margin-left: 1rem;
    margin-right: 1rem;

    a {
      font-size: 0.75rem;
      display: block;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .tip__article {
    background-color: $thumbnail_background_color;
    background-image: url("../../assets/defaultImg.svg");
    background-position: 95% center;
    background-repeat: no-repeat;
    background-size: 30%;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    height: 10.5rem;
    margin-left: 1rem;
    margin-right: 1rem;
    min-height: 5.9rem;
    padding: 0;
    position: relative;

    .preview__image {
      background-color: $thumbnail_background_color;
      height: 10.5rem;
      object-fit: cover;
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    .tip__article__content {
      color: #babac0;
      font-size: 0.75rem;
      height: 10.5rem;
      line-height: 1.1rem;
      padding: 0.85rem 1rem 0.8rem 1rem;
      display: flex;
      flex-direction: column;

      .title {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        margin-bottom: 0.15rem;
        color: $tip_note_color;
      }

      .description {
        @include truncate-overflow-mx(4);

        margin-bottom: 0.35rem;
        color: $preview_description_font_color;
      }
    }

    .tip__article--hasresults {
      display: flex;

      .preview__image {
        flex: 0 0 35%;
        max-width: 35%;
        min-width: 35%;
        width: 35%;
      }

      .tip__article__content {
        flex: 0 0 65%;
        max-width: 65%;
        min-width: 65%;
        width: 65%;
      }
    }

    .site__url {
      align-items: center;
      display: flex;
      flex-grow: 1;
      font-weight: 500;
      margin-bottom: 0.45rem;

      svg {
        flex-grow: 0;
        flex-shrink: 0;
        margin-right: 0.335rem;
      }

      a {
        color: $light_font_color;
        display: inline-flex;
        height: 1rem;
        max-width: 100%;
        align-items: center;

        &:hover {
          text-decoration: underline;

          img {
            filter: brightness(1.3);
          }
        }
      }
    }

    &:hover {
      background-color: $thumbnail_background_color_alt;
      cursor: pointer;

      .preview__image {
        background-color: $thumbnail_background_color_alt;
      }

      .tip__article__content {
        color: #c6c6cc;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .tip__record {
      position: relative;

      .tip__article {
        min-height: 2rem;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .tip__amount:nth-child(2) .retip__container {
      left: -50%;
      right: -50%;
    }

    .tip-title,
    .tip__article .tip__article__content {
      font-size: 0.75rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .tip-title {
      font-size: 0.75rem;
    }

    .tip__footer .tip__amount img {
      width: 0.7rem;
    }

    .tip__article .tip__article__content {
      font-size: 0.65rem;
    }
  }

  @include smallest {
    .tip__body {
      padding: 0;
    }

    .tip__record {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      position: relative;

      .tip__body .tip__description .author-and-date ::v-deep {
        font-size: 0.6rem;
        padding-left: 0;
        padding-right: 0;

        img {
          height: 1.5rem;
          width: 1.5rem;
        }

        .address {
          font-size: 0.55rem;
        }
      }
    }

    .tip__article {
      margin-left: 0;
      max-width: calc(100% + 1rem);
      width: 100%;

      .tip__article__content {
        line-height: 1.1rem;

        .description {
          @include truncate-overflow-mx(5);
        }
      }

      .site__url {
        text-decoration: underline;
      }
    }

    .tip-title {
      padding: 0;
    }

    .tip__footer {
      font-size: 0.65rem;
      padding: 0.85rem 0 0 0;

      .tip__amount img {
        width: 1rem;
      }
    }

    .tip__url {
      margin: 0 0 0.4rem 0;
    }
  }
</style>
