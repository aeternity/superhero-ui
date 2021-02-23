<template>
  <ButtonPlain
    class="outlined-button"
    v-bind="$attrs"
    @click="$emit('click', $event)"
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
.outlined-button {
  border: 0.05rem solid $standard_font_color;
  border-radius: 0.25rem;
  color: $standard_font_color;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.6rem;
  min-width: 8rem;
  transition: 0.3s;
  transition-property: color, background-color, opacity;
  opacity: 0.7;

  &.unpadded {
    padding: 0.2rem;
    min-width: 3rem;
  }

  &:hover,
  &.active {
    border-color: $custom_links_color;
    color: $custom_links_color;
    opacity: 1;
  }

  &.blue {
    color: $secondary_color;
    border-color: $secondary_color;

    &:hover {
      color: $standard_font_color;
      background-color: $secondary_color;
    }
  }

  &.green {
    color: $custom_links_color;
    border-color: $custom_links_color;

    &:hover,
    &.active {
      background-color: rgba($custom_links_color, 0.1);
    }
  }

  &.red {
    color: $red_color;
    border-color: $red_color;

    &:hover,
    &.active {
      background-color: rgba($red_color, 0.1);
    }
  }

  &.fullwidth {
    width: 100%;
  }

  &:disabled {
    opacity: 0.4;
    color: $tip_note_color;
    border-color: $tip_note_color;

    &:hover {
      background-color: unset;
    }
  }
}
</style>
