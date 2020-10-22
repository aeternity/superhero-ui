<template>
  <div
    class="soundcloud-player"
    @click.stop
  >
    <iframe
      ref="iframe"
      class="soundcloud-iframe"
      :src="playUrl"
    />
    <PlayButton class="play-button"
      :is-playing="isPlaying"
      :loading="loading"
      @click.stop="togglePlay"
    />
    <div
      ref="soundWave"
      class="sound-wave"
      @click="seekToPosition"
    >
      <div class="wave-wrapper">
        <img
          class="wave-grey"
          src="../../assets/soundWave.svg"
        >
        <div
          class="wave-green"
          :style="waveProgress"
        />
      </div>
      <div class="wave-wrapper flipped">
        <img
          class="wave-grey"
          src="../../assets/soundWave.svg"
        >
        <div
          class="wave-green"
          :style="waveProgress"
        />
      </div>
      <div class="display-time">
        <span>{{ progress | formatTime }}</span>
        <span class="right">{{ duration | formatTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SoundcloudWidget from 'soundcloud-widget';
import PlayButton from '../PlayButton.vue';

export default {
  components: { PlayButton },
  filters: {
    formatTime: (timestamp) => {
      const seconds = Math.floor(timestamp / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      return [
        ...hours ? [hours] : [],
        ...[minutes % 60, seconds % 60].map((t) => t.toString().padStart(2, '0')),
      ].join(':');
    },
  },
  props: {
    tip: { type: Object, required: true },
  },
  data() {
    return {
      player: null,
      isPlaying: false,
      loading: true,
      progress: 0,
      duration: 0,
      position: 0,
    };
  },
  computed: {
    playUrl() {
      return `https://w.soundcloud.com/player/?url=${this.tip.url}`;
    },
    waveProgress() {
      return { width: `${this.position}%`, 'background-size': `${(1 / this.position) * 10000}% 100%` };
    },
  },
  mounted() {
    this.player = new SoundcloudWidget(this.$refs.iframe);
    const soundcloudEvents = SoundcloudWidget.events;

    this.player.on(soundcloudEvents.READY, () => {
      this.loading = false;
      this.player.play();
      this.player.getDuration().then((d) => { this.duration = d || 0; });
    });
    this.player.on(soundcloudEvents.PLAY, () => {
      this.isPlaying = true;
    });
    this.player.on(soundcloudEvents.PAUSE, () => {
      this.isPlaying = false;
    });
    this.player.on(soundcloudEvents.PLAY_PROGRESS, (p) => {
      this.progress = p.currentPosition;
      this.position = p.relativePosition * 100;
      if (this.progress >= this.duration * 0.999) {
        this.player.seekTo(0);
      }
    });
  },
  methods: {
    togglePlay() {
      this.player.toggle();
    },
    seekToPosition(e) {
      const x = e.pageX;
      const leftOffset = this.$refs.soundWave.getBoundingClientRect().left;
      const width = this.$refs.soundWave.clientWidth;
      const scrub = x - leftOffset;
      const seek = this.duration * (scrub / width);
      this.player.seekTo(seek);
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

  .play-button {
    flex-shrink: 0;
  }

  .sound-wave {
    flex-grow: 1;
    height: 2.5rem;
    margin-left: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: left;
    position: relative;

    .wave-wrapper {
      position: relative;
      display: inline-block;

      .wave-grey {
        filter: grayscale(100%);
        width: 100%;
        height: 100%;
      }

      .wave-green {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-image: url("../../assets/soundWave.svg");
        background-position: top left;
        transition: background-image 1s linear;
      }

      &.flipped {
        transform: scaleY(-1);
        opacity: 0.5;
        height: 50%;
      }
    }

    .display-time {
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: 100%;
      bottom: 33%;

      span {
        font-size: 0.5rem;
        background-color: $article_content_color;
        padding: 0 0.1rem;
        border-radius: 2px;
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }
}
</style>
