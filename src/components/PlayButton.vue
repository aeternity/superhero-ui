<template>
  <ButtonPlain
    class="play-button"
    :disabled="loading"
    @click="$emit('click', $event)"
  >
    <Spinner v-if="loading" />
    <img
      v-else
      :src="isPlaying ? buttonPause : buttonPlay"
    >
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';
import Spinner from './Spinner.vue';
import buttonPause from '../assets/buttonPause.svg';
import buttonPlay from '../assets/buttonPlay.svg';

export default {
  components: { ButtonPlain, Spinner },
  props: {
    isPlaying: Boolean,
    loading: Boolean,
  },
  data: () => ({ buttonPause, buttonPlay }),
};
</script>

<style lang="scss" scoped>
.play-button {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  background-color: $article_content_color;
  border-radius: 50%;

  .spinner,
  img {
    margin: auto;
  }

  .spinner {
    width: 64%;
    height: 64%;
    color: $standard_font_color;
  }

  img {
    width: 44%;
  }
}
</style>
