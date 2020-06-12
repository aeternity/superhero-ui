<template>
  <Page>
    <div class="tutorial-page">
      <h1>
        {{ $t('views.CreateProfile.header1') }} <br>
        {{ $t('views.CreateProfile.header2') }} <br>
        {{ $t('views.CreateProfile.header3') }}
      </h1>
      <hr width="30%">

      <ExpandableBlock
        v-for="(item, index) in $t('views.CreateProfile.sections').length"
        :key="index"
        :title="$t('views.CreateProfile.sections')[index].title"
      >
        <i18n
          :path="`views.CreateProfile.sections[${index}].text`"
          tag="p"
        >
          <template v-slot:extensionFirefox>
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/superhero-wallet/"
              target="_blank"
            >
              {{ $t('views.CreateProfile.here') }}
            </a>
          </template>

          <template v-slot:extensionChrome>
            <a
              href="https://chrome.google.com/webstore/detail/superhero/mnhmmkepfddpifjkamaligfeemcbhdne"
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
};
</script>
