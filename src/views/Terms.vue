<template>
  <Page>
    <div class="row content">
      <div class="col-sm-12">
        <h1>{{ $t('views.Terms.title') }}</h1>
        <p>
          {{ $t('views.Terms.subtitle') }}
        </p>

        <i18n
          v-for="(item, index) in $t('views.Terms.sections').length"
          :key="index"
          :path="getI18nPath(index, 'Terms')"
          :tag="isTitle(index, 'Terms') ? 'h5' : 'p'"
        />

        <p>
          {{ $t('views.Terms.copyrights') }}
        </p>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../components/layout/Page.vue';
import { isTitle, getI18nPath } from '../utils/util';

export default {
  name: 'Terms',
  components: {
    Page,
  },
  data() {
    return {
      getI18nPath,
      isTitle,
    };
  },
};
</script>
