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

import TippingContractUtil from '../../utils/tippingContractUtil';
import Topic from './Topic.vue';

export default {
  name: 'TipTitle',
  components: { Topic },
  props: {
    tip: { type: Object, required: true },
    goToTip: { type: Function, required: true },
  },
  computed: {
    splitByTopics() {
      return this.tip.title.split(TippingContractUtil.topicsRegex).map((part) => {
        const matches = TippingContractUtil.topicsRegex.test(part);

        return {
          text: part,
          matches,
        };
      });
    },
  },
};
</script>

<style lang="scss">
  .title {
    display: inline;

    .topiclink {
      color: $custom_links_color;
    }
  }

</style>
