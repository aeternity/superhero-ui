<template>
  <div class="you-tube-embed">
    <CookiesDialog
      v-if="showCookiesDialog && !isAllowed"
      scope="YouTube"
      @close="showCookiesDialog = false"
    />
    <iframe
      v-if="isPlaying && isAllowed"
      :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`"
      frameborder="0"
      allow="accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture"
      allowfullscreen
    />
    <template v-if="!isPlaying">
      <TipPreviewImage
        :tip-url="tipUrl"
        :image="`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`"
        :source="sourceUrl"
        :title="tipPreviewTitle"
        :description="tipPreviewDescription"
      />
      <PlayButton
        @click="isAllowed ? isPlaying = true : showCookiesDialog = true"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PlayButton from '../PlayButton.vue';
import CookiesDialog from '../CookiesDialog.vue';
import TipPreviewImage from './TipPreviewImage.vue';

export default {
  components: { PlayButton, CookiesDialog, TipPreviewImage },
  props: {
    tipUrl: { type: String, required: true },
    tipPreviewTitle: { type: String, default: '' },
    tipPreviewDescription: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  data: () => ({
    isPlaying: false,
    showCookiesDialog: false,
  }),
  computed: {
    videoId() {
      const getIdRegex = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
      return this.tipUrl.match(getIdRegex)?.[3] || '';
    },
    ...mapState({
      isAllowed: (state) => state.cookiesConsent.YouTube,
    }),
  },
};

</script>

<style lang="scss" scoped>
.you-tube-embed {
  position: relative;

  iframe {
    display: block;
    width: 100%;
    background: #000;

    @include feed-preview-height;
  }

  .play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    background-color: $secondary_color;
    opacity: 0.8;
    height: 3rem;
    width: 3rem;
    margin-left: -1.5rem;
    margin-top: -1.5rem;
  }
}
</style>
