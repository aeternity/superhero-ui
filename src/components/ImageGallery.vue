<template>
  <div class="image-gallery">
    <ButtonPlain
      class="close"
      @click="resolve"
    >
      <IconClose />
    </ButtonPlain>
    <ButtonPlain
      class="arrow left"
      @click="currentIndex = (media.length + currentIndex - 1) % media.length"
    >
      <IconLeftArrow />
    </ButtonPlain>
    <ButtonPlain
      class="arrow right"
      @click="currentIndex = (currentIndex + 1) % media.length"
    >
      <IconRightArrow />
    </ButtonPlain>
    <div class="image-wrapper">
      <img :src="media[currentIndex]">
    </div>
    <div class="bottom-row">
      <MediaRow
        :active="currentIndex"
        :media="media"
        @get-index="currentIndex = $event"
      />
    </div>
  </div>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';
import MediaRow from './MediaRow.vue';
import IconClose from '../assets/iconClose.svg?icon-component';
import IconLeftArrow from '../assets/iconLeftArrow.svg?icon-component';
import IconRightArrow from '../assets/iconRightArrow.svg?icon-component';

export default {
  components: {
    ButtonPlain,
    IconClose,
    IconLeftArrow,
    IconRightArrow,
    MediaRow,
  },
  props: {
    resolve: { type: Function, required: true },
    imageIndex: { type: [Number, null], required: true },
    media: { type: Array, required: true },
  },
  data() {
    return { currentIndex: this.imageIndex };
  },
};
</script>

<style lang="scss" scoped>
.image-gallery {
  z-index: 101;
  background-color: rgba(18, 18, 27, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .close {
    position: absolute;
    top: 0.5rem;
    right: 1.5rem;

    svg {
      height: 1rem;
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    margin-top: -1rem;
    padding: 0.5rem;
    border-radius: 50%;
    background-color: $thumbnail_background_color;

    svg {
      height: 1.5rem;
    }

    &.left {
      left: 1rem;
    }

    &.right {
      right: 1.5rem;
    }
  }

  .image-wrapper,
  .bottom-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-wrapper {
    flex-grow: 1;
    min-height: 0;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .bottom-row {
    width: 100%;
    background-color: $actions_ribbon_background_color;
    padding-bottom: 0.5rem;
  }

  button {
    opacity: 0.66;
    color: $standard_font_color;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
