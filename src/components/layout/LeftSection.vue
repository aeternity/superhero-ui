<template>
  <div class="left-section">
    <Navigation />
    <Overview />

    <div class="powered-by">
      {{ $t('components.layout.Overview.PoweredBy') }}
      <a
        href="https://aeternity.com/"
        target="_blank"
      >
        <img src="../../assets/aeternityLogo.svg">
      </a>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';
import Overview from './Overview.vue';

export default {
  name: 'LeftSection',
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
