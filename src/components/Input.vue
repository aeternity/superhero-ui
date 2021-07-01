<template>
  <input
    class="input"
    v-bind="$attrs"
    v-on="{
      ...$listeners,
      input: event => $emit('input', event.target.value),
    }"
  >
</template>

<style lang="scss" scoped>
.input {
  background-color: $buttons_background;
  border: solid transparent;
  border-width: 1px 0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  line-height: 22.65px;
  color: $standard_font_color;
  padding: 8.5px 16px;

  &:focus {
    border-color: $secondary_color;
    background-color: $actions_ribbon_background_color;
  }
}
</style>
