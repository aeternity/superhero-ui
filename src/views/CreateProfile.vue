<template>
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
        <template #br>
          <br>
        </template>
      </i18n>
    </ExpandableBlock>
  </div>
</template>

<script>
import ExpandableBlock from '../components/ExpandableBlock.vue';

export default {
  components: {
    ExpandableBlock,
  },
  metaInfo: {
    title: 'Tutorial Page',
  },
};
</script>
