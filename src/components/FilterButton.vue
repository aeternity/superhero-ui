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
  font-weight: 700;
  color: $tip_note_color;
  display: inline-block;
  padding: 0.35rem 0.7rem;
  border: none;
  background-color: transparent;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;

  &:hover {
    color: $pure_white;
  }

  &.active {
    color: $custom_links_color;
    background-color: rgba(0, 255, 157, 0.1);
  }

  &:focus {
    outline: none;
  }
}
</style>
