<template>
  <div
    class="tip-media"
    :class="`template${Math.min(media.length, 4)}`"
  >
    <img
      v-for="(image, index) in media.slice(0, 4)"
      :key="index"
      :style="{ 'grid-area': `pos${index}` }"
      :src="image"
      loading="lazy"
      @click="openImageGallery(index)"
      @error="$event.target.src = defaultImage"
    >
    <span
      v-if="media.length > 4"
      class="show-more"
    >{{ `+${media.length - 4}` }}</span>
  </div>
</template>

<script>
import defaultImage from '../../assets/defaultImg.svg';

export default {
  props: {
    media: { type: Array, required: true },
  },
  data: () => ({ defaultImage }),
  methods: {
    openImageGallery(imageIndex) {
      this.$store.dispatch('modals/open', {
        name: 'image-gallery', media: this.media, imageIndex,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-media {
  margin-top: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  display: grid;
  position: relative;

  @include feed-preview-height;

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
</style>
