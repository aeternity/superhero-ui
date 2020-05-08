<template>
  <Page>
    <div class="container wrapper mt-2">
      <div class="row content">
        <div class="col-sm-12">
          <h1>{{ $t('views.Privacy.title') }}</h1>

          <p>
            {{ $t('views.Privacy.subtitle') }}
          </p>

          <template
            v-for="(item, index) in
              Object.keys($i18n.messages[$i18n.fallbackLocale].views.Privacy.sections).length"
          >
            <i18n
              :key="index"
              :path="getI18nPath(index, 'Privacy')"
              :tag="isTitle(index, 'Privacy') ? 'h5' : 'p'"
            />
          </template>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../components/layout/Page.vue';

export default {
  name: 'Privacy',
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

<style lang="scss" scoped>
  .content {
    color: $primary_color;
  }

  .container.wrapper {
    min-height: 4rem;
  }

  @media only screen
    and (min-device-width: 320px)
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2) {
    .content {
      padding: 1rem;
    }
  }
</style>
