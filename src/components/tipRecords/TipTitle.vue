<template>
  <div>
    <div
      v-for="(part, id) in splitByTopics"
      :key="id"
      class="title"
    >
      <Topic
        v-if="part.matches"
        :topic="part.text"
      />
      <span
        v-else
        @click="goToTip(tip.id)"
      >
        {{ part.text }}
      </span>
    </div>
  </div>
</template>

<script>

import { topicsRegex } from '@/utils/util';
import Topic from './Topic.vue';

export default {
  components: { Topic },
  props: {
    tip: { type: Object, required: true },
    goToTip: { type: Function, required: true },
  },
  computed: {
    splitByTopics() {
      return this.tip.title.split(topicsRegex).map((part) => {
        const matches = topicsRegex.test(part);

        return {
          text: part,
          matches,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .title {
    display: inline;

    .topiclink {
      color: $custom_links_color;
    }
  }
</style>
