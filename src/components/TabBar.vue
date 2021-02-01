<template>
  <div class="tab-bar">
    <ButtonPlain
      v-for="tab in tabs"
      :key="tab.text"
      :class="{ active: value === tab.tab }"
      @click="updateValue(tab.tab)"
    >
      {{ tab.text }}
    </ButtonPlain>
    <div class="right">
      <slot />
    </div>
  </div>
</template>

<script>

import ButtonPlain from './ButtonPlain.vue';

export default {
  components: {
    ButtonPlain,
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
.tab-bar {
  padding: 0 1.125rem;
  background-color: $actions_ribbon_background_color;
  display: flex;

  button {
    color: $light_font_color;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-right: 19px;
    border-bottom: 2px solid transparent;
    transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }

    &.active {
      border-color: $custom_links_color;
      color: $custom_links_color;
    }
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
