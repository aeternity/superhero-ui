<template>
  <div class="activity-ribbon">
    <FilterButton
      v-for="tab in tabs"
      :key="tab.text"
      :class="{ active: value === tab.activity }"
      @click="updateValue(tab.activity)"
    >
      <Component :is="tab.icon" />

      <span class="text">
        {{ tab.text }}
      </span>
    </FilterButton>
    <slot name="left" />
    <div class="separator" />
    <slot />
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
    value: { type: String, required: true },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.activity-ribbon {
  background-color: $light_color;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  margin-bottom: 0.15rem;
  display: flex;
  align-items: center;

  .text {
    padding-left: 0.15rem;
  }

  .separator {
    flex-grow: 1;
  }
}
</style>
