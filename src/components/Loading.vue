<template>
  <div :class="['loading', { 'above-content': aboveContent, small }]">
    <div class="spinner-border" />
  </div>
</template>

<script>
export default {
  props: { aboveContent: Boolean, small: Boolean },
};
</script>

<style lang="scss" scoped>
.loading {
  z-index: 3;
  height: 3rem;
  width: 100%;
  text-align: center;
  padding: 0.5rem;
  color: $light_font_color;

  &.above-content {
    margin-bottom: -3rem;
    position: relative;
  }

  &.small {
    height: 0.8rem;

    .spinner-border {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
