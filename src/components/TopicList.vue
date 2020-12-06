<template>
  <div class="topic-list">
    <div
      v-for="[topic, data] in topics"
      :key="topic"
      class="row"
    >
      <Topic
        class="text-ellipsis"
        :topic="topic"
      />
      <AeAmountFiat :amount="data.amount" />
    </div>
  </div>
</template>

<script>
import Backend from '../utils/backend';
import Topic from './tipRecords/Topic.vue';
import AeAmountFiat from './AeAmountFiat.vue';

export default {
  components: { Topic, AeAmountFiat },
  data: () => ({ topics: [] }),
  async prefetch() {
    this.topics = (await Backend.getTopics()).filter(([t]) => t !== '#test');
  },
};
</script>

<style lang="scss" scoped>
.topic-list {
  .row {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;

    .topic {
      flex-grow: 1;
    }

    .ae-amount-fiat {
      flex-shrink: 0;
    }
  }
}
</style>
