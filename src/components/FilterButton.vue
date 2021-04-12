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
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: $light_font_color;
  display: inline-block;
  padding: 0.35rem 0.7rem;
  transition: 0.3s;
  transition-property: color, background-color;

  &:hover {
    color: $tip_note_color;
  }

  &.active,
  &.router-link-exact-active {
    color: $custom_links_color;
    background-color: rgba(0, 255, 157, 0.1);
  }

  &:focus {
    outline: none;
  }
}
</style>
