<template>
  <div class="tab-bar">
    <TabBarButton
      v-for="tab in tabs"
      :key="tab.text"
      :class="{ active: value === tab.tab }"
      @click="updateValue(tab.tab)"
    >
      <span> {{ tab.text }}</span>
      <Component :is="tab.icon" />
    </TabBarButton>
    <slot name="left" />
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>

import TabBarButton from './TabBarButton.vue';

export default {
  components: {
    TabBarButton,
  },
  props: {
    tabs: { type: Array, default: () => [] },
    value: { type: String, default: '' },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  padding: 0 24px;
  background-color: $actions_ribbon_background_color;
  display: flex;

  .tab-bar-button:last-of-type {
    margin-right: 0;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 2px;
  }
}
</style>
