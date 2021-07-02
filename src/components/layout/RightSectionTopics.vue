<template>
  <div
    class="right-section-topics"
    :class="{ closed }"
  >
    <RightSectionTitle
      v-bind="$attrs"
      :closed="closed"
    >
      {{ $t('components.layout.RightSection.Trending') }}
    </RightSectionTitle>

    <TopicList />
  </div>
</template>

<script>
import RightSectionTitle from './RightSectionTitle.vue';
import TopicList from '../TopicList.vue';

export default {
  components: {
    RightSectionTitle, TopicList,
  },
  props: { closed: Boolean },
};
</script>

<style lang="scss" scoped>
.right-section-topics {
  padding: 8px 16px;

  &.closed {
    .right-section-title {
      padding-bottom: 0;
    }

    .topic-list {
      max-height: 0;
    }
  }

  .topic-list {
    transition: max-height 0.25s;
    -ms-overflow-style: none;
    overflow-y: auto;
    scrollbar-width: none;
    max-height: 18rem;
    font-size: 0.75rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-height: 900px) {
      max-height: 160px;
    }
  }
}
</style>
