<template>
  <ButtonPlain
    class="button-feed"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="icon" /> <span><slot /></span>
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: { ButtonPlain },
};
</script>

<style lang="scss" scoped>
.button-feed {
  font-size: 0.8rem;

  &:not([disabled]):hover ::v-deep svg {
    transition: color 0.3s;
    color: $standard_font_color;
  }

  &[disabled] {
    cursor: default;
  }

  ::v-deep {
    svg,
    span {
      vertical-align: middle;
    }

    svg {
      width: 1rem;
      height: 1rem;
      color: $search_nav_border_color;
    }

    span {
      color: $standard_font_color;
    }
  }
}
</style>
