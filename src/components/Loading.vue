<template>
  <div class="text-center spinner__container w-100" v-bind:class="{ active: showLoading }">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: ['showLoading']
  }
</script>

<style lang="scss" scoped>
  .spinner__container {
    opacity: 0;
    max-height: 0;
    transition: opacity 0.25s ease-in;

    &.active {
      max-height: 200px;
      opacity: 100%;
    }
  }
</style>
