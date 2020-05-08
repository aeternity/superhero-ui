<template>
  <Page>
    <div class="container wrapper">
      <div class="content tutorial-page">
        <h1>
          {{ $t('views.CreateProfile.header1') }} <br>
          {{ $t('views.CreateProfile.header2') }} <br>
          {{ $t('views.CreateProfile.header3') }}
        </h1>
        <hr width="30%">

        <template
          v-for="(item, index) in
            Object.keys($i18n.messages[$i18n.fallbackLocale].views.CreateProfile.sections).length"
        >
          <ExpandableBlock
            :key="index"
            :title="$t('views.CreateProfile.sections')[index].title"
          >
            <i18n
              :key="index"
              :path="getI18nPath(index)"
              tag="p"
            >
              <template v-slot:extensionFirefox>
                <a
                  :href="firefoxLink"
                  target="_blank"
                >
                  {{ $t('views.CreateProfile.here') }}
                </a>
              </template>

              <template v-slot:extensionChrome>
                <a
                  :href="chromeLink"
                  target="_blank"
                >
                  {{ $t('views.CreateProfile.here') }}
                </a>
              </template>

              <template v-slot:br>
                <br>
              </template>

              <template v-slot:tipButton>
                <img src="../assets/iconExtension.svg">
              </template>

              <template v-slot:feedbackForm>
                <a
                  href="https://form.jotform.com/201075183408046"
                  target="_blank"
                >
                  {{ $t('views.CreateProfile.feedbackForm') }}
                </a>
              </template>
            </i18n>
          </ExpandableBlock>
        </template>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../components/layout/Page.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';

export default {
  name: 'CreateProfile',
  components: {
    Page,
    ExpandableBlock,
  },
  computed: {
    chromeLink() {
      return 'https://chrome.google.com/webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne';
    },
    firefoxLink() {
      return 'https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/';
    },
    templateRootNode() {
      return new DOMParser()
        .parseFromString(`<root>${this.template}</root>`, 'text/xml').childNodes[0];
    },
  },
  methods: {
    getI18nPath(index) {
      return `views.CreateProfile.sections[${index}].text`;
    },
  },
};
</script>

<style lang="scss">
.tutorial-page {
  color: $standard_font_color;

  .spacer {
    margin-bottom: 1rem;
  }

  .icons-margin {
    margin-right: 1rem;
  }

  .highlited {
    color: $standard_font_color;
    font-weight: 500;
  }
}
</style>
