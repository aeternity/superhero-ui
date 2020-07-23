<template>
  <div class="right-section">
    <SearchInput
      class="section"
      sided
    />

    <RightSectionWallet
      class="section"
      :open="!showTopics"
      @toggle="showTopics = !showTopics"
    />

    <RightSectionTopics
      class="section"
      :open="showTopics"
      @toggle="showTopics = !showTopics"
    />

    <FooterSection />
  </div>
</template>

<script>
import FooterSection from './FooterSection.vue';
import SearchInput from './SearchInput.vue';
import RightSectionWallet from './RightSectionWallet.vue';
import RightSectionTopics from './RightSectionTopics.vue';

export default {
  name: 'RightSection',
  components: {
    SearchInput,
    RightSectionWallet,
    RightSectionTopics,
    FooterSection,
  },
  data: () => ({
    showTopics: false,
  }),
};
</script>

<style lang="scss" scoped>
.right-section .section {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
