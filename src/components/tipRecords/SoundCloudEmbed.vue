<template>
  <div
    class="sound-cloud-player tip__two-columns-preview"
  >
    <CookiesDialog
      v-if="showCookiesDialog && !isAllowed"
      scope="SoundCloud"
      @click="showCookiesDialog = false"
    />
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
        @click.stop="play('SoundCloud')"
      />
      <SoundCloudPlayer
        v-else-if="isPlaying && isAllowed"
        :tip="tip"
        @click.stop
      />
    </div>
  </div>
</template>

<script>
import SoundCloudPlayer from './SoundCloudPlayer.vue';
import PlayButton from '../PlayButton.vue';
import CookiesDialog from '../CookiesDialog.vue';
import embededPlayerMixin from '../../utils/embededPlayerMixin';

export default {
  components: { SoundCloudPlayer, PlayButton, CookiesDialog },
  mixins: [embededPlayerMixin],
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
    tipPreviewImage: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
  },
  computed: {
    isAllowed() {
      return this.checkForAllowed('SoundCloud');
    },
  },
};
</script>

<style lang="scss" scoped>
.sound-cloud-player {
  height: 100%;
  position: relative;
}

.description {
  @include truncate-overflow-mx(3);
}
</style>
