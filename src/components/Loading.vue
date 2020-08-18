<template>
  <div
    class="loading"
    :class="{ 'above-content': aboveContent }"
  >
    <div class="spinner-border text-primary" />
  </div>
</template>

<script>
export default {
  props: { aboveContent: Boolean },
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
}
</style>
