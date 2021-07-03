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
  line-height: 22px;
  padding: 8px 16px;
  color: $tip_note_color;
  height: 40px;
  transition: color 0.3s, background-color 0.3s;
  margin-right: 8px;
  white-space: nowrap;

  svg {
    color: $pure_white;
    opacity: 0.7;
    transition: opacity 0.3s;
    height: 24px;
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

  &:hover:not(.router-link-exact-active):not(.active) {
    color: $pure_white;
    background-color: $thumbnail_hover_color;

    svg {
      opacity: 1;
    }
  }
}
</style>
