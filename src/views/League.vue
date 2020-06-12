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
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: var(--container-width);
}

.league-page iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .league-page {
    top: 3.4rem;
  }
}
</style>
