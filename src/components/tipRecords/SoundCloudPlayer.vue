<template>
  <div
    class="soundcloud-player"
    @click.stop
  >
    <iframe
      :id="`sc-player-${tip.id}`"
      class="soundcloud-iframe"
      :src="playUrl"
    />
    <div
      class="play"
    >
      <div
        v-if="loading"
        class="spinner-border spinner-border-sm text-primary loading"
      />
      <img
        v-else-if="isPlaying"
        class="pause-button"
        src="../../assets/buttonPause.svg"
        @click="togglePlay"
      >
      <img
        v-else-if="!isPlaying"
        class="play-button"
        src="../../assets/buttonPlay.svg"
        @click="togglePlay"
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    tip: { type: Object, required: true },
    scApiUrl: { type: String, required: true },
  },
  data() {
    return {
      player: null,
      isPlaying: false,
      loading: true,
      progress: 0,
      currentSound: {},
    };
  },
  computed: {
    playUrl() {
      return `${this.scApiUrl}?url=${this.tip.url}`;
    },
  },
  mounted() {
    this.player = window.SC.Widget(document.getElementById(`sc-player-${this.tip.id}`));
    const soundcloudEvents = window.SC.Widget.Events;
    this.player.bind(soundcloudEvents.READY, () => {
      this.loading = false;
      this.player.play();
    });
    this.player.bind(soundcloudEvents.PLAY, () => {
      this.isPlaying = true;
    });
    this.player.bind(soundcloudEvents.PAUSE, () => {
      this.isPlaying = false;
    });
    this.player.bind(soundcloudEvents.PLAY_PROGRESS, (p) => {
      this.progress = p.relativePosition;
    });
  },
  methods: {
    togglePlay() {
      this.player.toggle();
    },
  },
};
</script>

<style lang="scss" scoped>
  .soundcloud-player {
    display: flex;
    align-items: center;

    .soundcloud-iframe {
      display: none;
    }

    .play {
      height: 2.5rem;
      width: 2.5rem;
      margin-left: 0.5rem;
      margin-top: 0.5rem;
      cursor: pointer;
      background-color: $article_content_color;
      border-radius: 50%;

      .play-button {
        width: 100%;
        padding: 0.8rem;
        margin-left: 0.15rem;
      }

      .pause-button {
        width: 100%;
        padding: 0.8rem;
      }

      .loading {
        margin: 0.8rem;
      }
    }
  }
</style>
