<template>
  <a
    :disabled="disabled"
    class="button-link"
    :href="href"
    :target="target"
    :title="title"
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
  background: transparent;
  border: 0.05rem solid $standard_font_color;
  border-radius: 0.25rem;
  color: $standard_font_color;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.625rem 2.15rem 0.725rem 2.15rem;
  text-align: center;

  &:hover {
    border: 0.05rem solid $custom_links_color;
    color: $custom_links_color;
    cursor: pointer;
    text-decoration: none;
  }

  &.primary {
    color: $secondary_color;
    border: 0.05rem solid $secondary_color;

    &:hover {
      color: $custom_links_color;
      border: 0.05rem solid $custom_links_color;
    }
  }

  &.fullwidth {
    width: 100%;
  }
}
</style>
