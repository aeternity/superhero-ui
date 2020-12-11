<template>
  <div class="tip-media">
    <ImageGallery
      v-if="openGallery"
      :media="media"
      @close="openGallery = false"
    />
    <div
      class="media-container"
      @click.stop="openGallery = true"
    >
      <img
        v-if="media.length === 1"
        :src="media[0]"
        class="full"
        loading="lazy"
        @error="$event.target.src = require('../../assets/defaultImg.svg')"
      >
      <template v-else>
        <img
          :src="media[0]"
          class="half"
        >
        <img
          v-if="media.length === 2"
          :src="media[1]"
          class="half"
        >
        <div v-else>
          <img
            class="quarter"
            :src="media[1]"
          >
          <img
            v-if="media.length === 3"
            class="quarter"
            :src="media[2]"
          >
          <template else>
            <img
              class="eighth"
              :src="media[2]"
            >
            <img
              class="eighth"
              :src="media[3]"
            >
            <span
              v-if="media.length > 4"
              class="show-more"
            >{{ `+${media.length - 4}` }}</span>
          </template>
        </div>
      </template>
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

  .media-container {
    display: flex;
    max-width: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    height: 100%;
    overflow: hidden;
  }

  img {
    cursor: pointer;
    transition: 0.4s filter;
    object-fit: cover;

    &:hover {
      filter: brightness(1.3);
    }

    &.full {
      width: 100%;
      height: 100%;
    }

    &.half {
      width: 50%;
      height: 100%;
    }

    &.quarter {
      width: 100%;
      height: 50%;
    }

    &.eighth {
      width: 50%;
      height: 100%;
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
