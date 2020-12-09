<template>
  <div class="tutorial-page">
    <h1>{{ $t('views.Widget.header') }}</h1>
    <hr width="30%">

    <i18n
      v-for="(item, index) in $t('views.Widget.sections').length"
      :key="index"
      :path="`views.Widget.sections[${index}].text`"
      tag="p"
    />
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Tutorial Widget Page',
  },
};
</script>
