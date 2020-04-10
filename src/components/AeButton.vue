<template>
  <button
    :disabled="disabled"
    class="btn btn-primary ae-button"
    type="submit"
    @click="$emit('click', $event)"
  >
    <img
      v-if="src"
      :src="src"
    >
    <span><slot /></span>
  </button>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    src: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.ae-button {
  color: $standard_font_color;
  background-color: $secondary_color;
  border: none;

  &[disabled] {
    background-color: $preview_description_font_color;
  }

  span {
    vertical-align: inherit;
  }
}
</style>
