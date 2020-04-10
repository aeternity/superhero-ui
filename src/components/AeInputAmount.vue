<template>
  <div class="input-group">
    <input
      :value="value"
      v-bind="$attrs"
      type="number"
      :min="min"
      :step="step"
      placeholder="Amount"
      class="form-control"
      aria-label="Default"
      aria-describedby="inputGroup-sizing-mn"
      @input="$emit('input', $event.target.value)"
    >
    <div class="input-group-append">
      <span class="input-group-text append__ae">
        <span class="ae">AE&nbsp;</span>
        <fiat-value
          display-symbol
          :amount="value.toString()"
        />
      </span>
    </div>
  </div>
</template>

<script>
import FiatValue from './FiatValue.vue';

export default {
  name: 'AeInputAmount',
  components: {
    FiatValue,
  },
  props: {
    min: { type: Number, default: 0 },
    step: { type: Number, default: 0.1 },
    value: { type: [Number, String], required: true },
  },
};
</script>

<style lang="scss" scoped>
.input-group {
  border: .05rem solid $buttons_background;
  border-radius: 0.25rem;

  &:focus-within {
    border: .05rem solid $custom_links_color;
  }

  input, input ~ .input-group-append > span.append__ae {
    border: 0;

    &:focus {
      border: 0;
    }
  }

  .input-group-append > span.append__ae {
    font-size: 0.75rem;
    background: $buttons_background;
    cursor: default;

    .ae {
      color: $secondary_color;
    }
  }
}
</style>
