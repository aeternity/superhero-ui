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
