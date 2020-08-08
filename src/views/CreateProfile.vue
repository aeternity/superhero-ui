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
        v-for="({ title }, index) in $t('views.CreateProfile.sections')"
        :key="title"
        :title="title"
      >
        <i18n
          :path="`views.CreateProfile.sections[${index}].text`"
          tag="p"
        >
          <template v-slot:br>
            <br>
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
