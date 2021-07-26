<template>
  <div class="activity-ribbon">
    <slot />
    <div
      v-if="$slots.right"
      class="separator"
    />
    <slot name="right" />
  </div>
</template>

<style lang="scss" scoped>
.activity-ribbon {
  background-color: $light_color;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  margin-bottom: 0.15rem;
  display: flex;
  align-items: center;

  ::v-deep .filter-button {
    svg,
    span {
      vertical-align: middle;
    }
  }

  .separator {
    flex-grow: 1;
  }
}
</style>
