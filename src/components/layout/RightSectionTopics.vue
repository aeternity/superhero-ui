<template>
  <div
    class="right-section-topics"
    :class="{ closed }"
  >
    <RightSectionTitle
      v-bind="$attrs"
      :closed="closed"
    >
      <img src="../../assets/iconTrending.svg">
      {{ $t('components.layout.RightSection.Trending') }}
    </RightSectionTitle>

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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RightSectionTitle from './RightSectionTitle.vue';
import Topic from '../tipRecords/Topic.vue';
import AeAmountFiat from '../AeAmountFiat.vue';

export default {
  components: { RightSectionTitle, Topic, AeAmountFiat },
  props: { closed: Boolean },
  computed: mapState({
    topics: ({ topics }) => topics.filter(([t]) => t !== '#test'),
  }),
};
</script>

<style lang="scss" scoped>
.right-section-topics {
  padding: 0.8rem 1rem;

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

    @media (max-height: 800px) {
      max-height: 10rem;
    }

    .not-bootstrap-row {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;

      .topic {
        flex-grow: 1;
      }

      .ae-amount-fiat {
        flex-shrink: 0;

        .ae-amount .ae {
          color: $secondary_color;
        }
      }
    }
  }
}
</style>
