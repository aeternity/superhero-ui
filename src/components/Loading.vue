<template>
  <div class="text-center spinner__container w-100">
    <div
      class="spinner-border text-primary"
      role="status"
    >
      <span class="sr-only">{{ $t('loading') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
};
</script>

<style lang="scss" scoped>
  .spinner__container {
    transition: opacity 0.25s ease-in;
    max-height: 200px;
    opacity: 1;
    z-index: 3;
  }
</style>
