<template>
  <Link
    class="tip-preview-image"
    :to="tipUrl"
  >
    <img
      :src="image"
      loading="lazy"
      @error="$event.target.src = defaultImage"
    >
    <TipUrlDetails v-bind="$attrs" />
  </Link>
</template>

<script>
import Link from '../Link.vue';
import TipUrlDetails from './TipUrlDetails.vue';
import defaultImage from '../../assets/defaultImg.svg';

export default {
  components: { Link, TipUrlDetails },
  inheritAttrs: false,
  props: {
    tipUrl: { type: String, required: true },
    image: { type: String, default: defaultImage },
  },
  data: () => ({ defaultImage }),
};
</script>

<style lang="scss" scoped>
.tip-preview-image {
  background: #000;
  display: block;
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
