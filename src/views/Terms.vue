<template>
  <div class="terms">
    <h1>{{ $t('views.Terms.title') }}</h1>
    <p>
      {{ $t('views.Terms.subtitle') }}
    </p>

    <i18n
      v-for="(item, index) in $t('views.Terms.sections').length"
      :key="index"
      :path="getI18nPath(index, 'Terms')"
      :tag="isTitle(index, 'Terms') ? 'h5' : 'p'"
    />

    <p>
      {{ $t('views.Terms.copyrights') }}
    </p>
  </div>
</template>

<script>
import { isTitle, getI18nPath } from '../utils/util';

export default {
  name: 'Terms',
  methods: {
    getI18nPath,
    isTitle,
  },
};
</script>

<style lang="scss" scoped>
.terms {
  padding-top: 0.5rem;
}
</style>
