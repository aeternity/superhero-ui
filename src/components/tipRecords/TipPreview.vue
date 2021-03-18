<template>
  <div class="tip-article">
    <div
      v-if="richPreviewComponent && isPreviewToBeVisualized"
      class="tip-article-hasresults"
    >
      <div class="tip-article-content">
        <div class="tip-embed">
          <Component
            :is="richPreviewComponent"
            :tip="tip"
            :tip-preview-title="tipPreviewTitle"
            :tip-preview-description="tipPreviewDescription"
            :tip-preview-image="tipPreviewImage"
            :source-url="sourceUrl"
            :go-to-tip="goToTip"
          />
        </div>
        <div class="tip-links">
          <div
            class="tip-amount"
            @click.stop
          >
            <TipInput :tip="tip" />
          </div>
          <div
            class="site-url"
            :title="tip.url"
          >
            <a
              class="text-ellipsis"
              target="_blank"
              :href="tipUrl"
              @click.stop
            >
              <ExternalLink />
              <span class="text-ellipsis">{{ tip.url }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="isPreviewToBeVisualized"
      class="tip-article-hasresults"
    >
      <div class="tip-article-content">
        <div class="tip-cover-preview">
          <img
            :src="tipPreviewImage"
            loading="lazy"
            @error="$event.target.src = require('../../assets/defaultImg.svg')"
          >
          <div class="tip-info">
            <div class="source">
              {{ sourceUrl }}
            </div>
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
          </div>
        </div>
        <div class="tip-links">
          <div
            class="tip-amount"
            @click.stop
          >
            <TipInput :tip="tip" />
          </div>
          <div
            class="site-url"
            :title="tip.url"
          >
            <a
              class="text-ellipsis"
              target="_blank"
              :href="tipUrl"
              @click.stop
            >
              <ExternalLink />
              <span class="text-ellipsis">{{ tip.url }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="tip-article-content"
    >
      <div class="tip-no-preview">
        <div class="source">
          {{ sourceUrl }}
        </div>
        <div
          v-if="tip.receiver"
          class="tip-author"
          :title="tip.receiver"
          @click.stop
        >
          <TipInput :tip="tip" />
          <RouterLink :to="{ name: 'user-profile', params: { address: tip.receiver } }">
            <Avatar :address="tip.receiver" />
            <div class="tip-author_name">
              <span class="chain-name">
                {{ tip.ChainName.name }}
              </span>
              <span class="address">{{ tip.receiver }}</span>
            </div>
          </RouterLink>
        </div>
        <!-- eslint-disable-next-line vue-i18n/no-raw-text -->
        <div v-else>
          No preview available for this URL
        </div>
      </div>
      <div class="tip-links">
        <div
          class="tip-amount"
          @click.stop
        >
          <TipInput :tip="tip" />
        </div>
        <div
          class="site-url"
          :title="tip.url"
        >
          <template v-if="tip.url">
            <a
              class="text-ellipsis"
              target="_blank"
              :href="tip.url"
              @click.stop
            >
              <ExternalLink />
              <span class="text-ellipsis">{{ tip.url }}</span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Backend from '../../utils/backend';
import YouTubeEmbed from './YouTubeEmbed.vue';
import TwitterEmbed from './TwitterEmbed.vue';
import SoundCloudEmbed from './SoundCloudEmbed.vue';
import ExternalLink from '../../assets/externalLink.svg?icon-component';
import Avatar from '../Avatar.vue';
import TipInput from '../TipInput.vue';

export default {
  components: {
    Avatar,
    TipInput,
    ExternalLink,
    YouTubeEmbed,
    TwitterEmbed,
    SoundCloudEmbed,
  },
  props: {
    tip: { type: Object, required: true },
    goToTip: { type: Function, required: true },
    tipUrl: { type: String, default: '' },
  },
  computed: {
    sourceUrl() {
      try {
        return new URL(this.tip.url).hostname;
      } catch {
        return '';
      }
    },
    tipPreviewDescription() {
      return this.tip?.preview?.description || '';
    },
    tipPreviewTitle() {
      return this.tip?.preview?.title || '';
    },
    tipPreviewImage() {
      return this.isPreviewToBeVisualized && this.tip.preview.image !== null ? Backend.getTipPreviewUrl(this.tip.preview.image) : '';
    },
    isPreviewToBeVisualized() {
      return this.tip.preview && (this.tip.preview.description || this.tip.preview.title);
    },
    richPreviewComponent() {
      return [{
        regex: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch|([a-zA-Z0-9_-]{11})).*$/,
        component: YouTubeEmbed,
      }, {
        regex: /^(https?:\/\/)?(www\.)?twitter\.com\//,
        component: TwitterEmbed,
      }, {
        regex: /^(https?:\/\/)?(www\.)?soundcloud\.com\/[a-zA-Z0-9-_/]*$/,
        component: SoundCloudEmbed,
      }].find(({ regex }) => regex.test(this.tip.url))?.component;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-amount {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  height: 1rem;
  cursor: pointer;
  position: relative;
  width: max-content;
}

.tip-url {
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

.tip-article {
  background-color: $buttons_background;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  height: auto;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 0;
  position: relative;

  .tip-article-content {
    color: #babac0;
    font-size: 0.75rem;
    height: auto;
    line-height: 1.1rem;
    display: flex;
    flex-direction: column;

    .tip-embed {
      flex-grow: 1;
    }

    .tip-links {
      display: flex;
      margin-top: 0.5rem;

      .tip-amount {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }

      .site-url {
        flex-grow: 1;
        overflow: hidden;
      }
    }
  }

  .tip-article-hasresults {
    display: flex;

    .tip-article-content {
      flex: 0 0 100%;
      max-width: 100%;
      min-width: 100%;
      width: 100%;
    }
  }

  .site-url {
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

    .preview-image {
      background-color: $thumbnail_background_color_alt;
    }

    .tip-article-content {
      color: #c6c6cc;
    }
  }
}

@media only screen and (max-width: 1024px) {
  .tip-article {
    min-height: 2rem;
  }
}

@media only screen and (max-width: 768px) {
  .tip-amount:nth-child(2) .retip-container {
    left: -50%;
    right: -50%;
  }
}

@include smallest {
  .tip-article {
    margin-left: 0;
    max-width: calc(100% + 1rem);
    width: 100%;

    .tip-article-content {
      line-height: 1.1rem;

      .description {
        @include truncate-overflow-mx(5);
      }
    }

    .site-url {
      text-decoration: underline;
    }
  }

  .tip-url {
    margin: 0 0 0.4rem 0;
  }
}

::v-deep .source {
  font-size: 0.5rem;
  color: $light_font_color;
  margin-bottom: 0.15rem;
  text-transform: uppercase;
}

::v-deep .tip-cover-preview {
  position: relative;
  padding-top: 55%;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  background: #000;
  border-radius: 0.25rem 0.5rem 0 0;

  img {
    bottom: 0;
    display: block;
    left: 0;
    margin: auto;
    max-width: 100%;
    width: 100%;
    position: absolute;
    right: 0;
    top: 0;
    border: none;
    height: auto;
    cursor: pointer;
    transition: 0.4s all;
    overflow: hidden;
  }

  img:hover {
    opacity: 0.75;
  }
}

::v-deep .tip-info {
  width: 100%;
  max-width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.7);

  .title {
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.15rem;
    color: $tip_note_color;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .description {
    @include truncate-overflow-mx(1);

    font-size: 0.7rem;
    color: $tip_note_color;
  }
}

.tip-no-preview {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding-left: 0.5rem;
  padding-top: 0.5rem;
  background: $thumbnail_background_color_alt;
}

::v-deep .tip-two-columns-preview {
  display: flex;
  flex-direction: row;
  height: auto;
  -webkit-transition: 0.4s all;
  -moz-transition: 0.4s all;
  transition: 0.4s all;

  .tip-two-columns-img {
    flex: 0 0 35%;
    max-width: 35%;
    min-width: 35%;
    width: 35%;
    border-top-left-radius: 0.5rem;
    position: relative;
    padding-top: 35%;
    overflow: hidden;

    img {
      bottom: 0;
      display: block;
      left: 0;
      margin: auto;
      width: auto;
      position: absolute;
      top: 0;
      border: none;
      height: 100%;
      max-height: 100%;
      cursor: pointer;
      overflow: hidden;
    }
  }

  .tip-two-columns-info {
    flex: 0 0 65%;
    max-width: 65%;
    min-width: 65%;
    width: 65%;
    height: 100%;
    padding: 0.5rem;

    .source {
      font-size: 0.5rem;
      color: $light_font_color;
      margin-bottom: 0.15rem;
    }

    .title {
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 0.15rem;
      color: $tip_note_color;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .description {
      font-size: 0.7rem;
      color: $tip_note_color;
    }
  }

  .tip-no-preview {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0.5rem;
    background: $thumbnail_background_color_alt;

    .tip-author {
      align-items: center;
      color: $light_font_color;
      display: flex;
      font-size: 0.8rem;
      justify-content: space-between;
      padding: 0 1rem 0.9rem 1rem;

      .tip-date {
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
      .chain-name {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        word-break: break-all;
      }

      img.user-identicon,
      img.preview-image,
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

      .chain-name {
        color: #fff;
      }

      .tip-description .author-and-date .date .three-dots {
        font-size: 0.75rem;
        margin-left: 0.3rem;
      }
    }
  }

  ::v-deep .tip-two-columns-preview {
    display: flex;
    flex-direction: row;
    height: auto;
    -webkit-transition: 0.4s all;
    -moz-transition: 0.4s all;
    transition: 0.4s all;

    .tip-two-columns-img {
      flex: 0 0 35%;
      max-width: 35%;
      min-width: 35%;
      width: 35%;
      border-top-left-radius: 0.5rem;
      position: relative;
      padding-top: 35%;
      overflow: hidden;

      img {
        bottom: 0;
        display: block;
        left: 0;
        margin: auto;
        width: auto;
        position: absolute;
        top: 0;
        border: none;
        height: 100%;
        max-height: 100%;
        cursor: pointer;
        overflow: hidden;
      }
    }

    .tip-two-columns-info {
      flex: 0 0 65%;
      max-width: 65%;
      min-width: 65%;
      width: 65%;
      height: 100%;
      overflow: hidden;
      white-space: pre-wrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
