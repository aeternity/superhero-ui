<template>
  <div class="tip-media">
    <ImageGallery
      v-if="openGallery"
      :media="media"
      @close="openGallery = false"
    />
    <div
      class="media-container"
      :class="`template${Math.min(media.length, 4)}`"
      @click.stop="openGallery = true"
    >
      <img
        v-for="(image, index) in media.slice(0,4)"
        :key="index"
        :style="{ 'grid-area': `pos${index}` }"
        :src="image"
        loading="lazy"
        @error="$event.target.src = require('../../assets/defaultImg.svg')"
      >
      <span
        v-if="media.length > 4"
        class="show-more"
      >{{ `+${media.length - 4}` }}</span>
    </div>
  </div>
</template>

<script>
import ImageGallery from '../ImageGallery.vue';

export default {
  components: { ImageGallery },
  props: {
    media: { type: Array, required: true },
  },
  data: () => ({ openGallery: false }),
};
</script>

<style lang="scss" scoped>
.tip-media {
  padding-top: 55%;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  border-radius: 0.5rem;
  height: 0;

  .media-container {
    max-width: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    height: 100%;
    overflow: hidden;
    display: grid;

    &.template1 {
      grid-template: 'pos0' 100%;
    }

    &.template2 {
      grid-template: 'pos0 pos1' 100%;
    }

    &.template3 {
      grid-template:
        'pos0 pos1' 50%
        'pos0 pos2' 50%;
    }

    &.template4 {
      grid-template:
        'pos0 pos0 pos1 pos1' 50%
        'pos0 pos0 pos2 pos3' 50%;
    }

    img {
      cursor: pointer;
      transition: 0.4s filter;
      width: 100%;
      height: 100%;
      object-fit: cover;

      &:hover {
        filter: brightness(1.3);
      }
    }

    .show-more {
      color: $standard_font_color;
      font-size: 2rem;
      position: absolute;
      bottom: 25%;
      right: 12.5%;
      margin-right: -1rem;
      margin-bottom: -1rem;
    }
  }
}
</style>
