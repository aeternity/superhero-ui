<template>
  <div class="tip-preview">
    <Component
      :is="richPreviewComponent"
      v-if="richPreviewComponent && isPreviewToBeVisualized"
      :tip-url="tipUrl"
      :tip-preview-title="tipPreviewTitle"
      :tip-preview-description="tipPreviewDescription"
      :tip-preview-image="tipPreviewImage"
      :source-url="sourceUrl"
    />
    <TipPreviewImage
      v-else-if="isPreviewToBeVisualized"
      :tip-url="tipUrl"
      :image="tipPreviewImage"
      :source="sourceUrl"
      :title="tipPreviewTitle"
      :description="tipPreviewDescription"
    />
    <TipUrlDetails
      v-else
      :source="sourceUrl"
      class="no-preview"
    >
      <Author
        v-if="tip.receiver"
        :address="tip.receiver"
      />
      <div v-else>
        No preview available for this URL
      </div>
    </TipUrlDetails>

    <div class="actions">
      <TipInput :tip="tip" />
      <a
        target="_blank"
        :href="tipUrl"
      >
        <ExternalLink />
        <span>{{ tipUrl }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import Backend from '../../utils/backend';
import TipPreviewImage from './TipPreviewImage.vue';
import YouTubeEmbed from './YouTubeEmbed.vue';
import TwitterEmbed from './TwitterEmbed.vue';
import SoundCloudEmbed from './SoundCloudEmbed.vue';
import ExternalLink from '../../assets/externalLink.svg?icon-component';
import Author from './Author.vue';
import TipUrlDetails from './TipUrlDetails.vue';
import Avatar from '../Avatar.vue';
import TipInput from '../TipInput.vue';

export default {
  components: {
    TipPreviewImage,
    Author,
    TipUrlDetails,
    Avatar,
    TipInput,
    ExternalLink,
    YouTubeEmbed,
    TwitterEmbed,
    SoundCloudEmbed,
  },
  props: {
    tip: { type: Object, required: true },
    tipUrl: { type: String, default: '' },
  },
  computed: {
    sourceUrl() {
      try {
        return new URL(this.tipUrl).hostname;
      } catch {
        return '';
      }
    },
    tipPreviewDescription() {
      return this.tip?.linkPreview?.description || '';
    },
    tipPreviewTitle() {
      return this.tip?.linkPreview?.title || '';
    },
    tipPreviewImage() {
      return this.isPreviewToBeVisualized && this.tip.linkPreview.image
        && Backend.getTipPreviewUrl(this.tip.linkPreview.image);
    },
    isPreviewToBeVisualized() {
      return this.tip.linkPreview?.description || this.tip.linkPreview?.title;
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
      }].find(({ regex }) => regex.test(this.tipUrl))?.component;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-preview {
  background-color: $thumbnail_background_color_alt;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #babac0;
  line-height: 1.1rem;

  &:hover {
    background-color: #373843;
    color: #c6c6cc;
  }

  // TODO: add `overflow: hidden` after making dropdowns appearing in a separate node
  // to don't duplicate border-radius, and better margins
  ::v-deep .tip-preview-image,
  ::v-deep .tip-preview-image > img,
  ::v-deep .you-tube-embed > iframe, {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  ::v-deep .sound-cloud-embed > img,
  ::v-deep .twitter-embed > img {
    border-top-left-radius: 0.5rem;
  }

  .no-preview {
    padding: 0.5rem 0.5rem 0 0.5rem;
  }

  .actions {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;
    padding-bottom: 0.2rem; // TODO: replace with margin after adding `overflow: hidden`

    .tip-input {
      flex-shrink: 0;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    > a {
      flex-grow: 1;
      color: $light_font_color;
      font-weight: 500;

      @include text-ellipsis;

      &:hover {
        text-decoration: underline;
      }

      @include mobile {
        text-decoration: underline;
      }

      svg,
      span {
        vertical-align: middle;
      }

      svg {
        margin-right: 0.335rem;
      }
    }
  }
}
</style>
