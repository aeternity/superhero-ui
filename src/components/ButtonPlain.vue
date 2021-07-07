<template>
  <Component
    :is="!$attrs.disabled && ($attrs.to || $attrs['to-relative'])
      ? 'Link' : 'button'"
    v-bind="$attrs"
    class="button-plain"
    v-on="$listeners"
  >
    <slot />
  </Component>
</template>

<script>
import Link from './Link.vue';

export default {
  components: { Link },
};
</script>

<style lang="scss" scoped>
.button-plain {
  display: inline-block;
  outline: none;
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
