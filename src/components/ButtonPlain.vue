<template>
  <Component
    :is="!disabled && to ? 'Link' : 'button'"
    :to="to"
    :disabled="disabled"
    class="button-plain"
    @click="$emit('click', $event)"
  >
    <slot />
  </Component>
</template>

<script>
import Link from './Link.vue';

export default {
  components: { Link },
  props: {
    to: { type: [String, Object], default: null },
    disabled: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.button-plain {
  display: inline-block;
  border: none;
  background: transparent;
  padding: 0;
  text-decoration: none;
  text-align: center;
  font: inherit;
  color: inherit;
  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }
}
</style>
