<template>
  <button
    :disabled="disabled"
    class="btn btn-primary ae-button"
    type="submit"
    @click="$emit('click', $event)"
  >
    <Loading v-if="loading" />
    <template v-else>
      <img
        v-if="src"
        :src="src"
      >
      <span><slot /></span>
    </template>
  </button>
</template>

<script>
import Loading from './Loading.vue';

export default {
  components: {
    Loading,
  },
  props: {
    disabled: Boolean,
    src: { type: String, default: '' },
    loading: { type: Boolean },
  },
};
</script>

<style lang="scss" scoped>
.ae-button {
  height: 2.3rem;
  min-width: 4.5rem;
  color: $standard_font_color;
  background-color: $secondary_color;
  border: none;

  .loading {
    transform: scale(0.6);
    margin-top: -0.7rem;
  }

  &[disabled] {
    opacity: 0.4;
  }

  span {
    vertical-align: inherit;
  }

  &.green {
    background-color: $custom_links_color;
  }
}
</style>
