<template>
  <RouterLink
    class="topic"
    :to="{ name: 'feed-search', params: { query: topic } }"
  >
    <template>{{ topic }}</template>
  </RouterLink>
</template>

<script>
export default {
  props: {
    topic: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
.topic {
  color: $standard_font_color;

  &:hover {
    text-decoration: underline;
  }
}
</style>
