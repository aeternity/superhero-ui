<template>
  <div class="privacy">
    <h1>{{ $t('views.Privacy.title') }}</h1>

    <p>
      {{ $t('views.Privacy.subtitle') }}
    </p>

    <i18n
      v-for="(item, index) in $t('views.Privacy.sections').length"
      :key="index"
      :path="getI18nPath(index, 'Privacy')"
      :tag="isTitle(index, 'Privacy') ? 'h5' : 'p'"
    />
  </div>
</template>

<script>
import { isTitle, getI18nPath } from '../utils';

export default {
  methods: {
    getI18nPath,
    isTitle,
  },
};
</script>

<style lang="scss" scoped>
.privacy {
  padding-top: 0.5rem;
}
</style>
