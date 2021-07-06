<template>
  <div class="tip-title">
    <template v-for="(part, id) in splitByTopics">
      <Topic
        v-if="part.matches"
        :key="id"
        :topic="part.text"
        @click.native.stop
      />
      <template v-else>
        {{ part.text }}
      </template>
    </template>
  </div>
</template>

<script>
import { topicsRegex } from '../../utils';
import Topic from './Topic.vue';

export default {
  components: { Topic },
  props: {
    tipTitle: { type: String, required: true },
  },
  computed: {
    splitByTopics() {
      return this.tipTitle.split(topicsRegex).map((text) => ({
        text,
        matches: topicsRegex.test(text),
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-title {
  color: $tip_note_color;
  font-size: 0.85rem;
  line-height: 1.1rem;
  margin-bottom: 0.8rem;
}
</style>
