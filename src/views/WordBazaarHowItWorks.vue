<template>
  <div class="how-it-works">
    <h3>
      {{ $t('components.HowItWorks.Title') }}
    </h3>

    <p class="italic">
      {{ $t('components.HowItWorks.Subtitle') }}
    </p>

    <div
      v-for="(row, index) in $t('components.HowItWorks.Text')"
      :key="index"
    >
      <h4>{{ row.Header }}</h4>
      <i18n
        :path="`components.HowItWorks.Text[${index}].Paragraph`"
        tag="p"
      >
        <template #hr>
          <hr>
        </template>
        <template #link>
          <a :href="$t('components.HowItWorks.Link')">{{ $t('components.HowItWorks.Link') }}</a>
        </template>
      </i18n>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return { title: this.$t('views.WordBazaar.RibbonTabs.3.Text') };
  },
};
</script>

<style lang="scss" scoped>
.how-it-works {
  .italic {
    font-style: italic;
  }

  h3 {
    font-size: 1.1rem;
    padding-top: 1.1rem;
  }

  h4 {
    font-size: 0.9rem;
  }

  p {
    font-size: 0.75rem;
    color: $standard_font_color;
  }

  a {
    color: $secondary_color;
  }
}
</style>
