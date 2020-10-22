<template>
  <ButtonPlain
    class="play"
    :disabled="loading"
    @click="$emit('click', $event)"
  >
    <div
      v-if="loading"
      class="spinner-border spinner-border-sm text-primary loading"
    />
    <img
      v-else-if="!loading"
      :src="require(`../assets/button${isPlaying ? 'Pause' : 'Play'}.svg`)"
      :class="{ 'margin-fix': !isPlaying }"
    >
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: { ButtonPlain },
  props: {
    isPlaying: Boolean,
    loading: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.play {
  height: 2.5rem;
  width: 2.5rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  background-color: $article_content_color;
  border-radius: 50%;

  img {
    width: 100%;
    padding: 0.8rem;

    &.margin-fix {
      margin-left: 0.15rem !important;
    }
  }
}
</style>
