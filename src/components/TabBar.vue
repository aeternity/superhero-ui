<template>
  <div class="tab-bar">
    <a
      v-for="tab in tabs"
      :key="tab.text"
      :class="{ active: activeTab === tab.tab }"
      @click="set(tab.tab)"
    >
      {{ tab.text }}
    </a>
  </div>
</template>

<script>

export default {
  props: {
    tabs: { type: Array, required: true },
    activeTab: { type: String, required: true },
    set: { type: Function, required: true },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  padding: 0 1.5rem;
  background-color: $actions_ribbon_background_color;

  a {
    color: $light_font_color;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    margin-right: 0.5rem;
    padding: 0.5rem;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }

    &.active {
      border-bottom: 2px solid $custom_links_color;
      color: $custom_links_color;
    }
  }
}
</style>
