<template>
  <span
    :title="topic"
    class="topic"
    @click="searchTopic(topic)"
  >
    {{ topic }}
  </span>
</template>

<script>
import { EventBus } from '../../utils/eventBus';

export default {
  name: 'Topic',
  props: {
    topic: { type: String, required: true },
  },
  methods: {
    searchTopic(topic) {
      if (this.$route.name !== 'tips') {
        this.$router.push({
          name: 'tips',
          query: { searchTopicPhrase: topic },
        });
      } else {
        EventBus.$emit('searchTopic', topic);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .topic {
    color: $custom_links_color;

    &:hover {
      cursor: pointer;
    }
  }
</style>
