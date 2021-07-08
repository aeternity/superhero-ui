<template>
  <div class="sound-cloud-player">
    <CookiesDialog
      v-if="showCookiesDialog && !isAllowed"
      scope="SoundCloud"
      @close="showCookiesDialog = false"
    />
    <img :src="tipPreviewImage">
    <TipUrlDetails
      :source="sourceUrl"
      :title="tipPreviewTitle"
      :description="tipPreviewDescription"
    >
      <PlayButton
        v-if="!isPlaying"
        @click.stop="isAllowed ? isPlaying = true : showCookiesDialog = true"
      />
      <SoundCloudPlayer
        v-else-if="isPlaying && isAllowed"
        :tip-url="tipUrl"
        @click.stop
      />
    </TipUrlDetails>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SoundCloudPlayer from './SoundCloudPlayer.vue';
import TipUrlDetails from './TipUrlDetails.vue';
import PlayButton from '../PlayButton.vue';
import CookiesDialog from '../CookiesDialog.vue';

export default {
  components: {
    SoundCloudPlayer, TipUrlDetails, PlayButton, CookiesDialog,
  },
  props: {
    tipUrl: { type: String, required: true },
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
.sound-cloud-player {
  display: flex;

  img {
    width: 35%;
    object-fit: cover;
  }

  .tip-url-details ::v-deep .description {
    @include truncate-overflow-mx(3);
  }
}
</style>
