<template>
  <div
    class="loading"
    :class="{ 'above-content': aboveContent, 'small': small }"
  >
    <div class="spinner-border text-primary" />
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

  &.above-content {
    margin-bottom: -3rem;
    position: relative;
  }

  &.small {
    height: 1rem;

    .spinner-border {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
