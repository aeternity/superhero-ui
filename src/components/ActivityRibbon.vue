<template>
  <div class="activity-ribbon">
    <FilterButton
      v-for="tab in tabs"
      :key="tab.text"
      :class="{ active: activity === tab.activity }"
      @click="set(tab.activity)"
    >
      <Component :is="tab.icon" />

      <span class="vertical-align-mid activity-ribbon__text">
        {{ tab.text }}
      </span>
    </FilterButton>
  </div>
</template>

<script>
import FilterButton from './FilterButton.vue';

export default {
  components: {
    FilterButton,
  },
  props: {
    tabs: { type: Array, required: true },
    activity: { type: String, required: true },
    set: { type: Function, required: true },
  },
};
</script>

<style lang="scss" scoped>
.activity-ribbon {
  background-color: $light_color;
  padding: 0.5rem 0 0.5rem 0.75rem;
  margin-bottom: 0.15rem;

  .text {
    padding-left: 0.15rem;
  }
}
</style>
