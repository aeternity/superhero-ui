<template>
  <div class="trending">
    <BackButtonRibbon>
      <template #title>
        {{ $t('Trending topics') }}
      </template>
    </BackButtonRibbon>
    <TopicList />
  </div>
</template>

<script>
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import TopicList from '../components/TopicList.vue';

export default {
  components: { BackButtonRibbon, TopicList },
};
</script>

<style lang="scss" scoped>
.trending {
  .actions-ribbon {
    display: flex;

    ::v-deep .title {
      white-space: nowrap;
    }
  }

  .topic-list {
    padding: 0 8px;
  }
}
</style>
