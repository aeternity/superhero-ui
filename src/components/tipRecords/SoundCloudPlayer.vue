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
    <div
      ref="soundWave"
      class="sound-wave"
      @click="mousePosition"
    >
      <div class="wave-wrapper">
        <img
          class="wave-grey"
          src="../../assets/soundWave.svg"
        >
        <div
          class="wave-green"
          :style="{ 'width': `${position}%`, 'background-size': `${1 / position * 10000}% 100%` }"
        />
      </div>
      <div class="wave-wrapper flipped">
        <img
          class="wave-grey"
          src="../../assets/soundWave.svg"
        >
        <div
          class="wave-green"
          :style="{ 'width': `${position}%`, 'background-size': `${1 / position * 10000}% 100%` }"
        />
      </div>
      <div class="display-time">
        <span>{{ displayProgress }}</span>
        <span class="right">{{ displayDuration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

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
      duration: 0,
      position: 0,
    };
  },
  computed: {
    playUrl() {
      return `${this.scApiUrl}?url=${this.tip.url}`;
    },
    displayProgress() {
      return moment.utc(this.progress).format(this.progress < 3600000 ? 'mm:ss' : 'h:mm:ss');
    },
    displayDuration() {
      return moment.utc(this.duration).format(this.duration < 3600000 ? 'mm:ss' : 'h:mm:ss');
    },
  },
  mounted() {
    this.player = window.SC.Widget(document.getElementById(`sc-player-${this.tip.id}`));
    const soundcloudEvents = window.SC.Widget.Events;
    this.player.bind(soundcloudEvents.READY, () => {
      this.loading = false;
      this.player.play();
      this.player.getDuration((d) => { this.duration = d || 0; });
    });
    this.player.bind(soundcloudEvents.PLAY, () => {
      this.isPlaying = true;
    });
    this.player.bind(soundcloudEvents.PAUSE, () => {
      this.isPlaying = false;
    });
    this.player.bind(soundcloudEvents.PLAY_PROGRESS, (p) => {
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
    mousePosition(e) {
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

    .play {
      height: 2.5rem;
      width: 2.5rem;
      margin-left: 0.5rem;
      margin-top: 0.5rem;
      cursor: pointer;
      background-color: $article_content_color;
      border-radius: 50%;
      flex-shrink: 0;

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
