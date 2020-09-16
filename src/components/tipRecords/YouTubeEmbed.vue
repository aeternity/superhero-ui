<template>
  <div
    class="youtube-player"
  >
    <iframe
      v-if="isPlaying"
      :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay}&rel=${related}`"
      frameborder="0"
      allow="accelerometer;
      autoplay;
      clipboard-write;
      encrypted-media;
      gyroscope;
      picture-in-picture"
      allowfullscreen
    />
    <img
      v-if="!isPlaying"
      :src="`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`"
    >
    <div
      v-if="!isPlaying"
      class="play"
      @click="play"
    >
      <img
        class="play-button"
        src="../../assets/buttonPlay.svg"
      >
    </div>
    <div
      v-if="!isPlaying"
      class="video-info"
    >
      <div class="source">
        {{ sourceUrl.toUpperCase() }}
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
      autoplay: 1,
      related: 0,
    };
  },
  computed: {
    videoId() {
      const getIdRegex = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
      if (this.tip.url.match(getIdRegex) !== null) {
        return this.tip.url.match(getIdRegex)[3];
      }
      return '';
    },
  },
  methods: {
    play() {
      this.isPlaying = true;
    },
  },
};

</script>

<style lang="scss" scoped>
  .youtube-player {
    position: relative;
    padding-top: 55%;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background: #000;
    border-radius: 0.5rem 0.5rem 0 0;

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

    .video-info {
      width: 100%;
      max-width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.7);

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
        @include truncate-overflow-mx(1);

        font-size: 0.7rem;
        color: $tip_note_color;
      }
    }

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
      -webkit-transition: 0.4s all;
      -moz-transition: 0.4s all;
      transition: 0.4s all;
      overflow: hidden;
    }

    img:hover {
      opacity: 0.75;
    }

    iframe,
    object,
    embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      background: transparent;
    }
  }
</style>
