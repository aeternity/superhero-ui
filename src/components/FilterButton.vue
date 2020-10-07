<template>
  <button
    class="filter-button"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.filter-button {
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: $light_font_color;
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border: none;
  background-color: transparent;

  &.active {
    color: $custom_links_color;
    background-color: $thumbnail_background_color;
  }

  &:focus {
    outline: none;
  }
}
</style>
