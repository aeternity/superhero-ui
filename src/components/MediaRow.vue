<template>
  <div
    v-if="media.length"
    class="media-row"
  >
    <div
      v-for="(image, index) in media"
      :key="index"
      class="image-preview"
      :style="{ 'background-image': 'url(' + image + ')' }"
    >
      <ButtonPlain
        :class="{ clickable: !deleteBtn, active: active === index }"
        @click="$emit('get-index', index)"
      >
        <IconCancel v-if="deleteBtn" />
      </ButtonPlain>
    </div>
  </div>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';
import IconCancel from '../assets/iconCancel.svg?icon-component';

export default {
  components: {
    IconCancel,
    ButtonPlain,
  },
  props: {
    media: { type: Array, required: true },
    deleteBtn: Boolean,
    active: { type: Number, default: null },
  },
};
</script>

<style lang="scss" scoped>
.media-row {
  overflow-x: scroll;
  scrollbar-color: $light_font_color $actions_ribbon_background_color;
  scrollbar-width: thin;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;

  .image-preview {
    flex-shrink: 0;
    height: 2.625rem;
    width: 4rem;
    margin-right: 0.5rem;
    background-size: cover;
    background-position: center;
    border-radius: 0.25rem;
    position: relative;

    svg {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      background-color: $buttons_background;
      color: $standard_font_color;
      position: absolute;
      right: 2px;
      top: 2px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }

    .clickable {
      width: 100%;
      height: 100%;
      opacity: 0.4;
      background-color: $actions_ribbon_background_color;

      &:hover,
      &.active {
        opacity: 0;
      }
    }
  }

  &::-webkit-scrollbar {
    height: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background: $light_font_color;
    border-radius: 0.25rem;
  }
}
</style>
