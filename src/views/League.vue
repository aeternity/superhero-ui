<template>
  <Page class="league-page-container">
    <div class="league-page">
      <iframe src="https://league.superhero.com/?iframe=1" />
    </div>
  </Page>
</template>
<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'League',
  components: {
    Page,
  },
};
</script>
<style lang="scss">
.league-page-container {
  padding-top: 1rem;
}

.league-page {
  bottom: 0;
  position: absolute;
  top: 0;
  width: 31rem;
}

.league-page iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .league-page {
    max-width: 100vw;
    top: 3.4rem;
    width: 25rem;
  }
}
</style>
