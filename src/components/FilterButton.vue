<template>
  <ButtonPlain
    class="filter-button"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: { ButtonPlain },
};
</script>

<style lang="scss" scoped>
.filter-button {
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  padding: 8px 16px;
  color: $tip_note_color;
  display: inline-block;
  padding: 0.35rem 0.7rem;
  height: 40px;
  background-color: transparent;
  transition: 0.3s;
  transition-property: color, background-color;

  svg {
    color: $pure_white;
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
    height: 24px;
    width: auto;
    margin-bottom: 2px;
  }

  &.active,
  &.router-link-exact-active {
    color: $custom_links_color;
    background-color: rgba($custom_links_color, 0.1);

    svg {
      color: $custom_links_color;
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
  }

  &:hover:not(.router-link-active):not(.active) {
    color: $pure_white;
    background-color: $thumbnail_hover_color;
    cursor: pointer;

    svg {
      opacity: 1;
    }
  }
}
</style>
