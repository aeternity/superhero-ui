<template>
  <div class="dropdown">
    <div class="display">
      {{ displayValue }}
      <img src="../assets/carretDown.svg">
      <b-form-select
        v-model="selectedVal"
        :options="optionsVal"
        @change="method(selectedVal)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueDropdown',
  props: {
    options: { type: Array, default: null },
    selected: { type: String, default: '' },
    method: { type: Function, required: true },
  },
  data() {
    return {
      selectedVal: this.selected,
      optionsVal: this.options,
    };
  },
  computed: {
    displayValue() {
      const selectedOption = this.optionsVal.find((option) => option.value === this.selectedVal);
      return selectedOption ? selectedOption.text : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  display: inline-block;
  position: relative;
  min-width: 6rem;

  .display {
    text-align: center;
    position: relative;
    color: $standard_font_color;
    font-size: 0.75rem;
    background-color: $light_color;
    padding: 0.6rem 2.2rem 0.6rem 0.85rem;
    border-radius: 0.25rem;
    line-height: 0.9rem;
    min-height: 2.2rem;
    display: flex;
    align-items: center;

    img {
      position: absolute;
      right: 0.85rem;
    }

    &:hover {
      cursor: pointer;
    }
  }

  select {
    bottom: 0;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
