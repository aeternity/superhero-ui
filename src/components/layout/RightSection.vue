<template>
  <div class="right-section">
    <SearchFeed
      class="section"
      sided
    />

    <RightSectionWallet
      class="section"
      v-bind="toggleable && {
        closed: showTopics,
        toggleHandler: () => showTopics = !showTopics,
      }"
    />

    <RightSectionTopics
      class="section"
      v-bind="toggleable && {
        closed: !showTopics,
        toggleHandler: () => showTopics = !showTopics,
      }"
    />

    <FooterSection />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FooterSection from './FooterSection.vue';
import SearchFeed from './SearchFeed.vue';
import RightSectionWallet from './RightSectionWallet.vue';
import RightSectionTopics from './RightSectionTopics.vue';

export default {
  components: {
    SearchFeed,
    RightSectionWallet,
    RightSectionTopics,
    FooterSection,
  },
  data: () => ({
    showTopics: false,
  }),
  computed: mapState({ toggleable: ({ aeternity: { useIframeWallet } }) => useIframeWallet }),
};
</script>

<style lang="scss" scoped>
.right-section .section {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
