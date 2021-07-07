<template>
  <div class="you-tube-embed">
    <CookiesDialog
      v-if="showCookiesDialog && !isAllowed"
      scope="YouTube"
      @close="showCookiesDialog = false"
    />
    <div class="tip-cover-preview">
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
        <img :src="`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`">
        <PlayButton
          @click.stop="isAllowed ? isPlaying = true : showCookiesDialog = true"
        />
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
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PlayButton from '../PlayButton.vue';
import CookiesDialog from '../CookiesDialog.vue';

export default {
  components: { PlayButton, CookiesDialog },
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, default: '' },
    tipPreviewDescription: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  data() {
    return {
      isPlaying: false,
      showCookiesDialog: false,
    };
  },
  computed: {
    videoId() {
      const getIdRegex = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
      return this.tip.url.match(getIdRegex)?.[3] || '';
    },
    ...mapState({
      isAllowed: (state) => state.cookiesConsent.YouTube,
    }),
  },
};

</script>

<style lang="scss" scoped>
@import './preview-legacy';

.you-tube-embed {
  position: relative;
}

.play-button {
  z-index: 5;
  left: 50%;
  top: 50%;
  position: absolute;
  background-color: $secondary_color;
  opacity: 0.8;
  height: 3rem;
  width: 3rem;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background: transparent;
}
</style>
