<template>
  <div class="faq-page">
    <h1>{{ $t('views.FAQ.header') }}</h1>
    <hr width="30%">
    <i18n
      path="views.FAQ.subheader"
      tag="p"
    />

    <ExpandableBlock
      v-for="({ title }, index) in $t('views.FAQ.questions')"
      :key="title"
      :title="title"
    >
      <i18n
        :path="`views.FAQ.questions[${index}].text`"
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
    title: 'FAQ Page',
  },
};
</script>

<style lang="scss" scoped>
.faq-page {
  background-color: $light_color;
  padding: 1.75rem 2rem;

  h1 {
    font-size: 1.5rem;
    color: $standard_font_color;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.8rem;
    color: $text_content_color;
  }

  h1,
  p {
    text-align: center;
  }

  a {
    color: $custom_links_color;

    &:hover {
      filter: saturate(0.5) brightness(1.2);
    }
  }

  hr {
    border: 0;
    border-top: 1px solid $search_nav_border_color;
    margin-bottom: 1rem;
  }
}
</style>
