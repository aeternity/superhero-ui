<template>
  <div class="dropdown">
    <div class="display">
      {{ displayValue }}
      <img src="../assets/carretDown.svg">
    </div>
    <b-form-select
      v-model="selectedVal"
      :options="optionsVal"
      @change="method(selectedVal)"
    />
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
    width: 100%;
    position: absolute;
    color: $standard_font_color;
    font-size: .75rem;
    background-color: $light_color;
    padding: .6rem 1rem .7rem .8rem;
    border-radius: .25rem;
    line-height: .9rem;
    min-height: 2.2rem;

    img {
      @include vertical-align(absolute);
      right: .5rem;
    }

    &:hover {
      cursor: pointer;
    }
  }

  select {
    opacity: 0;
  }
  &:hover {
  }
}
</style>
