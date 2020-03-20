<template>
  <div>
    <div class="title" v-for="(part, id) in splitByTopics" :key="id">
      <topic v-if="part.matches" :topic="part.text"></topic>
      <span @click="goToTip(tip.id)" v-else>{{part.text}}</span>
    </div>
  </div>
</template>

<script>

import TippingContractUtil from '../../utils/tippingContractUtil';
import Topic from './Topic.vue';

export default {
  name: 'TipTitle',
  components: { Topic },
  props: ['tip', 'goToTip'],
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
