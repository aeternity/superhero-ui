<template>
  <div class="tutorial-page">
    <h1>{{ $t('views.Meet.header') }}</h1>
    <hr width="30%">

    <I18n
      v-for="(item, index) in $t('views.Meet.sections').length"
      :key="index"
      :path="`views.Meet.sections[${index}].text`"
      tag="p"
    />
  </div>
</template>
