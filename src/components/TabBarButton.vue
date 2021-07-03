<template>
  <ButtonPlain
    class="tab-bar-button"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: {
    ButtonPlain,
  },
};
</script>

<style lang="scss" scoped>
  .tab-bar-button {
    color: $light_font_color;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-right: 24px;
    border-bottom: 2px solid transparent;
    transition: 0.3s;
    transition-property: color, border-color;

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }

    &.active {
      border-color: $custom_links_color;
      color: $custom_links_color;
    }

    ::v-deep {
      svg,
      span {
        vertical-align: middle;
      }
    }
  }
</style>
