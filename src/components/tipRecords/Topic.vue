<template>
  <RouterLink
    class="topic"
    :to="{ name: 'tips-search', params: { query: topic } }"
  >
    {{ topic }}
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
    color: $custom_links_color;

    &:hover {
      cursor: pointer;
    }
  }
</style>
