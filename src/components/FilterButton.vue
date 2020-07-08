<template>
  <div
    class="filter-button"
    @click="$emit('click', $event)"
  >
    <slot />
  </div>
</template>

<script>

export default {
};
</script>

<style lang="scss" scoped>
.filter-button {
  border-radius: 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: $light_font_color;
  display: inline-block;
  padding: 0.45rem 0.9rem;

  &.active {
    color: $custom_links_color;
    background-color: $thumbnail_background_color;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
