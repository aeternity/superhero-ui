<template>
  <div class="app__leftcolumn">
    <div class="content">
      <navigation/>
      <overview/>
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
