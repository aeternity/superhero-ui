<template>
  <div :class="['loading', { 'above-content': aboveContent, small }]">
    <Spinner />
  </div>
</template>

<script>
import Spinner from './Spinner.vue';

export default {
  components: { Spinner },
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
    height: 0.8rem;

    .spinner {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
