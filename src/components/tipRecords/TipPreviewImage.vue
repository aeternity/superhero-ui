<template>
  <div class="tip-preview-image">
    <img
      :src="image"
      loading="lazy"
      @error="$event.target.src = defaultImage"
    >
    <TipUrlDetails v-bind="$attrs" />
    <slot />
  </div>
</template>

<script>
import TipUrlDetails from './TipUrlDetails.vue';
import defaultImage from '../../assets/defaultImg.svg';

export default {
  components: { TipUrlDetails },
  inheritAttrs: false,
  props: {
    image: { type: String, default: defaultImage },
  },
  data: () => ({ defaultImage }),
};
</script>

<style lang="scss" scoped>
.tip-preview-image {
  background: #000;
  position: relative;

  img {
    display: block;
    width: 100%;
    object-fit: cover;

    @include feed-preview-height;

    &:hover {
      transition: 0.4s opacity;
      opacity: 0.75;
    }
  }

  .tip-url-details {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
