<template>
  <div
    class="tip__rich-preview"
    @click.stop
  >
    <div class="tip__rich-preview--hasresults">
      <div class="tip__rich-preview__content">
        <div class="tip__embed">
          <YouTubeEmbed
            :tip="tip"
            :tip-preview-title="tipPreviewTitle"
            :tip-preview-description="tipPreviewDescription"
          />
        </div>
        <div class="tip__links">
          <div
            class="tip__amount"
            @click.stop
          >
            <TipInput :tip="tip" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TipInput from '../TipInput.vue';
import YouTubeEmbed from './YouTubeEmbed.vue';
import ExternalLink from '../../assets/externalLink.svg?icon-component';

export default {
  components: {
    TipInput,
    ExternalLink,
    YouTubeEmbed,
  },
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
  .tip__amount {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 1rem;
    cursor: pointer;
    position: relative;
    width: max-content;
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

  .tip__rich-preview {
    background-color: $buttons_background;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    height: auto;
    margin-left: 1rem;
    margin-right: 1rem;
    min-height: 5.9rem;
    padding: 0;
    position: relative;

    .tip__rich-preview__content {
      color: #babac0;
      font-size: 0.75rem;
      height: auto;
      line-height: 1.1rem;
      display: flex;
      flex-direction: column;

      .tip__embed {
        flex-grow: 1;
      }

      .tip__links {
        display: flex;
        margin-top: 0.5rem;

        .tip__amount {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .site__url {
          flex-grow: 1;
          overflow: hidden;
        }
      }
    }

    .tip__rich-preview--hasresults {
      display: flex;

      .tip__rich-preview__content {
        flex: 0 0 100%;
        max-width: 100%;
        min-width: 100%;
        width: 100%;
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

      .tip__rich-preview__content {
        color: #c6c6cc;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .tip__rich-preview {
      min-height: 2rem;
    }
  }

  @media only screen and (max-width: 768px) {
    .tip__amount:nth-child(2) .retip__container {
      left: -50%;
      right: -50%;
    }

    .tip__rich-preview .tip__rich-preview__content {
      font-size: 0.75rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .tip__rich-preview .tip__rich-preview__content {
      font-size: 0.65rem;
    }
  }

  @include smallest {
    .tip__rich-preview {
      margin-left: 0;
      max-width: calc(100% + 1rem);
      width: 100%;

      .tip__rich-preview__content {
        line-height: 1.1rem;

        .description {
          @include truncate-overflow-mx(5);
        }
      }

      .site__url {
        text-decoration: underline;
      }
    }

    .tip__url {
      margin: 0 0 0.4rem 0;
    }
  }
</style>
