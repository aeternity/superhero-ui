<template>
  <div class="how-it-works">
    <p class="subtitle">
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
  font-size: 15px;
  color: $tip_note_color;
  margin-top: 32px;
  padding-left: 24px;
  padding-right: 16px;

  p {
    margin-bottom: 32px;
  }

  .subtitle {
    color: $standard_font_color;
    margin-bottom: 18px;
    font-weight: 500;
  }

  h4 {
    font-size: 20px;
    font-weight: 500;
    color: $standard_font_color;
    margin-bottom: 12px;
  }

  a {
    color: $custom_links_color;
  }
}
</style>
