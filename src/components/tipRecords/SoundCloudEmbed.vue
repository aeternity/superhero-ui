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
      <PlayButton
        v-if="!isPlaying"
        :is-playing="isPlaying"
        @click.stop="isPlaying = true"
      />
      <SoundCloudPlayer
        v-else-if="isPlaying"
        :tip="tip"
        @click.stop
      />
    </div>
  </div>
</template>

<script>
import SoundCloudPlayer from './SoundCloudPlayer.vue';
import PlayButton from '../PlayButton.vue';

export default {
  components: { SoundCloudPlayer, PlayButton },
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
    };
  },
};
</script>

<style lang="scss" scoped>
.sound-cloud-player {
  height: 100%;
}

.description {
  @include truncate-overflow-mx(3);
}
</style>
