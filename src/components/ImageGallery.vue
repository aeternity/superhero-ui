<template>
  <div
    class="image-gallery"
    @click.stop
  >
    <ButtonPlain
      class="close"
      @click="$emit('close')"
    >
      <IconClose />
    </ButtonPlain>
    <ButtonPlain
      class="arrow left"
      @click="imageIndex = (media.length + imageIndex - 1) % media.length"
    >
      <ButtonLeftArrow />
    </ButtonPlain>
    <ButtonPlain
      class="arrow right"
      @click="imageIndex = (imageIndex + 1) % media.length"
    >
      <ButtonRightArrow />
    </ButtonPlain>
    <div class="image-wrapper">
      <img :src="media[imageIndex]">
    </div>
    <div
      class="bottom-row"
    >
      <MediaRow
        :media="media"
        :active="imageIndex"
        @get-index="imageIndex = $event"
      />
    </div>
  </div>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';
import MediaRow from './MediaRow.vue';
import IconClose from '../assets/iconClose.svg?icon-component';
import ButtonLeftArrow from '../assets/buttonLeftArrow.svg?icon-component';
import ButtonRightArrow from '../assets/buttonRightArrow.svg?icon-component';

export default {
  components: {
    ButtonPlain,
    IconClose,
    ButtonLeftArrow,
    ButtonRightArrow,
    MediaRow,
  },
  props: {
    media: { type: Array, required: true },
  },
  data: () => ({
    imageIndex: 0,
  }),
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
  cursor: default;
  display: flex;
  flex-direction: column;
  max-height: 100vh;

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
