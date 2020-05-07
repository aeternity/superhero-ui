<template>
  <div class="app__leftcolumn">
    <div class="content">
      <Navigation />
      <Overview />
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
