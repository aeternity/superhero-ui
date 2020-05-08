<template>
  <Page>
    <div class="container wrapper mt-2">
      <div class="content mission-page">
        <h1>{{ $t('views.Mission.header') }}</h1>
        <hr width="30%">

        <template
          v-for="(item, index) in
            Object.keys($i18n.messages[$i18n.fallbackLocale].views.Mission.sections).length"
        >
          <i18n
            :key="index"
            :path="getI18nPath(index, 'Mission')"
            :tag="isTitle(index, 'Mission') ? 'h5' : 'p'"
          >
            <template v-slot:aeternityBlockchain>
              <a
                href="https://aeternity.com/"
                target="_blank"
              > {{ $t('views.FAQ.aeternityBlockchain') }} </a>
            </template>
          </i18n>
        </template>
        <h1>{{ $t('views.Mission.footer') }}</h1>
        <p>{{ $t('views.Mission.footerContent') }}</p>
      </div>
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
  methods: {
    getI18nPath(index, page) {
      return this.isTitle(index, page)
        ? `views.${page}.sections[${index}].title` : `views.${page}.sections[${index}].text`;
    },
    isTitle(index, page) {
      return Object.prototype.hasOwnProperty.call(
        Object.values(this.$i18n.messages[this.$i18n.fallbackLocale].views[`${page}`].sections)[index],
        'title',
      );
    },
  },
};
</script>


<style lang="scss">
  .mission-page {
    background-image: url('../assets/Mission.jpg');
  }
</style>
