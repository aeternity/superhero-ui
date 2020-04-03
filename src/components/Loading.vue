<template>
  <div
    class="text-center spinner__container w-100"
    :class="{ active: showLoading }"
  >
    <div
      class="spinner-border text-primary"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    showLoading: { type: Boolean, required: true },
  },
};
</script>

<style lang="scss" scoped>
  .spinner__container {
    opacity: 0;
    max-height: 0;
    transition: opacity 0.25s ease-in;
    z-index: -1;

    &.active {
      max-height: 200px;
      opacity: 1;
      z-index: 3;
    }
  }
</style>
