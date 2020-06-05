<template>
  <Page class="governance-page-container">
    <div class="governance-page">
      <iframe src="https://governance.aeternity.com/#/?iframe=1" />
    </div>
  </Page>
</template>
<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'Governance',
  components: {
    Page,
  },
};
</script>
<style lang="scss" scoped>
.governance-page-container {
  padding-top: 1rem;
}

.governance-page {
  bottom: 0;
  position: absolute;
  top: 0;
  width: 31rem;
}

.governance-page iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .governance-page {
    max-width: 100vw;
    top: 3.4rem;
    width: 25rem;
  }

  .governance-page-container {
    padding-top: 0;
  }
}
</style>
