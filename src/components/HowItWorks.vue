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

<style lang="scss" scoped>
.how-it-works {
  .italic {
    font-style: italic;
  }

  a {
    color: $secondary_color;
  }
}
</style>
