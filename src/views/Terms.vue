<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="row content">
        <div class="col-sm-12">
          <h1>{{ $t('views.Terms.title') }}</h1>
          <p>
            {{ $t('views.Terms.subtitle') }}
          </p>

          <template
            v-for="(item, index) in
              Object.keys($i18n.messages[$i18n.fallbackLocale].views.Terms.sections).length"
          >
            <i18n
              :key="index"
              :path="getI18nPath(index)"
              :tag="isTitle(index) ? 'h5' : 'p'"
            />
          </template>

          <p>
            {{ $t('views.Terms.copyrights') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'Terms',
  components: {
    LeftSection,
    RightSection,
    MobileNavigation,
  },
  methods: {
    getI18nPath(index) {
      return this.isTitle(index)
        ? `views.Terms.sections[${index}].title` : `views.Terms.sections[${index}].text`;
    },
    isTitle(index) {
      return Object.prototype.hasOwnProperty.call(
        Object.values(this.$i18n.messages[this.$i18n.fallbackLocale].views.Terms.sections)[index],
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
