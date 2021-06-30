<template>
  <!--
    TODO: render as RouterLink if `to` is passed to support:
      - opening in a new tab by the middle button
      - hinting the URL at the bottom
      - navigation in SSR (including indexing)
  -->
  <button
    :disabled="disabled || loading"
    class="ae-button"
    :class="{ green }"
    type="submit"
    @click="clickHandler"
  >
    <Loading v-if="loading" />
    <slot v-else />
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
    loading: { type: Boolean },
    green: { type: Boolean },
    to: { type: [String, Object], default: null },
  },
  methods: {
    clickHandler(event) {
      this.$emit('click', event);
      if (!this.to) return;
      this.$router.push(this.to);
    },
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
  border-radius: 0.25rem;
  transition: background-color 0.3s;
  text-align: center;

  .loading {
    transform: scale(0.6);
    margin-top: -0.7rem;
  }

  &[disabled] {
    opacity: 0.4;
  }

  &.green {
    background-color: $custom_links_color;
  }

  &:hover:not(.green) {
    background-color: $button_hover_color;
  }
}
</style>
