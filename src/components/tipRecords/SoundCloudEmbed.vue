<template>
  <div
    class="sound-cloud-player"
  >
    <iframe
      v-if="isPlaying"
      width="100%"
      height="auto"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="playUrl"
    />
    <div
      v-else
      class="tip__two-columns-preview"
    >
      <div class="tip__two-columns-img">
        <img :src="tipPreviewImage">
      </div>

      <div class="tip__two-columns-info">
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
        <div
          v-if="!isPlaying"
          class="play"
          @click.stop="play"
        >
          <img
            class="play-button"
            src="../../assets/buttonPlay.svg"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
    tipPreviewImage: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  data() {
    return {
      isPlaying: false,
      scApiUrl: 'https://w.soundcloud.com/player/',
      color: 'color=%231d1e27',
      autoplay: 'auto_play=true',
      related: 'hide_related=true',
      comments: 'show_comments=false',
      showUser: 'show_user=false',
      reposts: 'show_reposts=false',
      teaser: 'show_teaser=false',
    };
  },
  computed: {
    playParams() {
      return `&${this.color}&${this.autoplay}&${this.related}&${this.comments}&${this.showUser}&${this.reposts}&${this.teaser}`;
    },
    playUrl() {
      return `${this.scApiUrl}?url=${this.tip.url}${this.playParams}`;
    },
  },
  methods: {
    play() {
      this.isPlaying = true;
    },
  },
};
</script>

<style lang="scss">
  .sound-cloud-player {
    height: 100%;
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
  }

  .description {
    @include truncate-overflow-mx(3);
  }
</style>
