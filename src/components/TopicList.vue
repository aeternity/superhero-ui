<template>
  <div class="topic-list">
    <div
      v-for="[topic, data] in topics"
      :key="topic"
      class="not-bootstrap-row"
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
import { mapState } from 'vuex';
import Topic from './tipRecords/Topic.vue';
import AeAmountFiat from './AeAmountFiat.vue';

export default {
  components: { Topic, AeAmountFiat },
  computed: mapState({
    topics: ({ topics }) => topics.filter(([t]) => t !== '#test'),
  }),
};
</script>

<style lang="scss" scoped>
.topic-list {
  .not-bootstrap-row {
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
