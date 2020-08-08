<template>
  <Page>
    <div class="mission-page">
      <h1>{{ $t('views.Mission.header') }}</h1>
      <hr width="30%">

      <i18n
        v-for="(item, index) in $t('views.Mission.sections').length"
        :key="index"
        :path="`views.Mission.sections[${index}].text`"
        tag="p"
      >
        <template v-slot:aeternityBlockchain>
          <a
            href="https://aeternity.com/"
            target="_blank"
          >
            {{ $t('aeternityBlockchain') }}
          </a>
        </template>
      </i18n>
      <h1>{{ $t('views.Mission.footer') }}</h1>
      <p>{{ $t('views.Mission.footerContent') }}</p>
    </div>
  </Page>
</template>

<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'FAQ',
  components: {
    Page,
  },
};
</script>

<style lang="scss">
  .mission-page {
    background-image: url('../assets/Mission.jpg');
  }
</style>
