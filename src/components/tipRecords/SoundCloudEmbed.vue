<template>
  <div
    class="sound-cloud-player tip__two-columns-preview"
  >
    <div class="tip__two-columns-img">
      <img :src="tipPreviewImage">
    </div>

    <div class="tip__two-columns-info">
      <div class="source">
        {{ sourceUrl.toUpperCase() }}
      </div>
      <h2 class="title text-ellipsis">
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
        <img src="../../assets/buttonPlay.svg">
      </div>
      <SoundCloudPlayer
        v-else-if="isPlaying"
        :tip="tip"
        :sc-api-url="scApiUrl"
        @click.stop
      />
    </div>
  </div>
</template>

<script>
import SoundCloudPlayer from './SoundCloudPlayer.vue';

export default {
  components: { SoundCloudPlayer },
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
    };
  },
  mounted() {
    this.loadScript(`${this.scApiUrl}api.js`);
  },
  methods: {
    play() {
      this.isPlaying = true;
    },
    loadScript(url) {
      const scripts = [].slice.call(document.getElementsByTagName('script')).filter((script) => script.src === url);
      if (scripts.length) {
        return;
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      document.getElementsByTagName('body')[0].appendChild(script);
    },
  },
};
</script>

<style lang="scss" scoped>
.sound-cloud-player {
  height: 100%;

  .play {
    height: 2.5rem;
    width: 2.5rem;
    margin-left: 0.5rem;
    margin-top: 0.5rem;
    cursor: pointer;
    background-color: $article_content_color;
    border-radius: 50%;

    img {
      width: 100%;
      padding: 0.8rem;
      margin-left: 0.15rem;
    }
  }
}

.description {
  @include truncate-overflow-mx(3);
}
</style>
