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
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  padding: 8px 16px;
  color: $tip_note_color;
  display: inline-block;
  border: none;
  height: 40px;
  background-color: transparent;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  margin-right: 8px;
  white-space: nowrap;

  svg {
    color: $pure_white;
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
    height: 24px;
    width: auto;
    margin-bottom: 2px;
  }

  &.active {
    color: $custom_links_color;
    background-color: rgba(0, 255, 157, 0.1);
    cursor: default;

    svg {
      color: $custom_links_color;
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
  }

  &:hover {
    &:not(.active) {
      color: $pure_white;
      background-color: $thumbnail_hover_color;
      cursor: pointer;

      svg {
        opacity: 1;
      }
    }
  }
}
</style>
