<template>
  <Page>
    <div class="league-page">
      <iframe src="https://aeternity.com/league-iframe/index.html" width="100%" />
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
.league-page iframe {
  border: 0;
  height: 99vh;
  width: 100%;
}
</style>
