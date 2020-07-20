<template>
  <div class="loading text-center w-100">
    <div
      class="spinner-border text-primary"
      role="status"
    >
      <span class="sr-only">{{ $t('loading') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  transition: opacity 0.25s ease-in;
  max-height: 200px;
  opacity: 1;
  z-index: 3;
}
</style>
