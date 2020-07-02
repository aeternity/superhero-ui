<template>
  <Page>
    <div class="tutorial-page">
      <h1>{{ $t('views.Wallet.header') }}</h1>
      <hr width="30%">

      <i18n
        v-for="(item, index) in $t('views.Wallet.sections').length"
        :key="index"
        :path="`views.Wallet.sections[${index}].text`"
        tag="p"
      />
    </div>
  </Page>
</template>

<script>
import Page from '../../components/layout/Page.vue';

export default {
  name: 'Wallet',
  components: {
    Page,
  },
};
</script>
