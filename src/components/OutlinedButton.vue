<template>
  <a
    class="button-link"
    v-bind="{ disabled, href, target, title }"
    @click="$emit('click', $event)"
  >
    <template>
      <slot />
    </template>
  </a>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    href: { type: String, default: '' },
    target: { type: String, default: '_self' },
    title: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.button-link {
  border: 0.05rem solid $standard_font_color;
  border-radius: 0.25rem;
  color: $standard_font_color;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.6rem;
  text-align: center;
  min-width: 8rem;

  &:hover {
    border-color: $custom_links_color;
    color: $custom_links_color;
    cursor: pointer;
    text-decoration: none;
  }

  &.blue {
    color: $secondary_color;
    border-color: $secondary_color;
  }

  &.green {
    color: $custom_links_color;
    border-color: $custom_links_color;
  }

  &.blue:hover,
  &.green:hover {
    color: $standard_font_color;
    border-color: $standard_font_color;
  }

  &.fullwidth {
    width: 100%;
  }
}
</style>
