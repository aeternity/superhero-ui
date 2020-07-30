<template>
  <div class="dropdown">
    <div
      class="display"
      :class="rounded ? 'rounded' : ''"
    >
      <div
        class="text-ellipsis"
        :title="displayValue"
      >
        {{ displayValue }}
      </div>
      <img src="../assets/carretDown.svg">
      <select
        v-model="selectedVal"
        @change="method(selectedVal)"
      >
        <option
          v-for="(option, idx) in optionsVal"
          :key="idx"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: { type: Array, default: null },
    selected: { type: String, default: '' },
    method: { type: Function, required: true },
    rounded: { type: Boolean },
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

  .display {
    text-align: center;
    position: relative;
    color: $standard_font_color;
    font-size: 0.75rem;
    background-color: $light_color;
    padding: 0.6rem 2.2rem 0.6rem 0.85rem;
    line-height: 0.9rem;
    min-height: 2.2rem;
    display: flex;
    align-items: center;

    .rounded {
      border-radius: 0.25rem;
    }

    img {
      position: absolute;
      right: 0.85rem;
    }

    & > div {
      display: inline-block;
    }
  }

  select {
    width: 100%;
    bottom: 0;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;

    &:hover {
      cursor: pointer;
    }

    option {
      font-size: 1rem;
    }
  }
}
</style>
