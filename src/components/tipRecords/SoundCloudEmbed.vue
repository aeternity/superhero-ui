<template>
  <div class="sound-cloud-player tip-two-columns-preview">
    <CookiesDialog
      v-if="showCookiesDialog && !isAllowed"
      scope="SoundCloud"
      @close="showCookiesDialog = false"
    />
    <div class="tip-two-columns-img">
      <img :src="tipPreviewImage">
    </div>
    <div class="tip-two-columns-info">
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
        @click.stop="isAllowed ? isPlaying = true : showCookiesDialog = true"
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
import { mapState } from 'vuex';
import SoundCloudPlayer from './SoundCloudPlayer.vue';
import PlayButton from '../PlayButton.vue';
import CookiesDialog from '../CookiesDialog.vue';

export default {
  components: { SoundCloudPlayer, PlayButton, CookiesDialog },
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
      showCookiesDialog: false,
    };
  },
  computed: mapState({
    isAllowed: (state) => state.cookiesConsent.SoundCloud,
  }),
};
</script>

<style lang="scss" scoped>
@import './preview-legacy';

.sound-cloud-player {
  height: 100%;
  position: relative;
}

.description {
  @include truncate-overflow-mx(3);
}
</style>
