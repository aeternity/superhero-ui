<template>
  <div
    class="tip__cover-preview"
  >
    <iframe
      v-if="isPlaying"
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
      <div
        class="play"
        @click.stop="isPlaying = true"
      >
        <img
          class="play-button"
          src="../../assets/buttonPlay.svg"
        >
      </div>
      <div class="tip__info">
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
</template>

<script>
export default {
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, default: '' },
    tipPreviewDescription: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  data() {
    return {
      isPlaying: false,
    };
  },
  computed: {
    videoId() {
      const getIdRegex = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
      return this.tip.url.match(getIdRegex)?.[3] || '';
    },
  },
};

</script>

<style lang="scss" scoped>
.play {
  z-index: 5;
  height: 3rem;
  width: 3rem;
  left: 50%;
  top: 50%;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
  position: absolute;
  cursor: pointer;
  background-color: $secondary_color;
  border-radius: 50%;
  opacity: 0.8;

  .play-button {
    padding: 0.8rem;
    margin-left: 0.15rem;
  }
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
