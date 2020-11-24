<template>
  <div class="left-section">
    <Navigation />
    <Overview />
  </div>
</template>

<script>
import Navigation from './Navigation.vue';
import Overview from './Overview.vue';

export default {
  components: {
    Overview,
    Navigation,
  },
};
</script>

<style lang="scss" scoped>
.left-section .powered-by {
  color: $standard_font_color;
  font-size: 0.7rem;

  a {
    &:hover {
      filter: brightness(1.3);
    }

    img {
      height: 0.55rem;
    }
  }
}
</style>
