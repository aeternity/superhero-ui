<template>
  <div class="input-group">
    <input
      :value="value"
      v-bind="$attrs"
      type="number"
      inputmode="decimal"
      :min="min"
      :step="step"
      :placeholder="$t('amount')"
      class="form-control"
      aria-label="Default"
      aria-describedby="inputGroup-sizing-mn"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    >
    <div class="input-group-append">
      <span
        class="input-group-text append__ae text-ellipsis"
        :title="value"
      >
        <span class="ae">AE&nbsp;</span>
        <FiatValue
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
    disabled: { type: Boolean },
  },
};
</script>

<style lang="scss" scoped>
.input-group {
  border: 0.05rem solid $buttons_background;
  border-radius: 0.25rem;

  .input-group-append {
    max-width: 65%;
  }

  .input-group-text {
    display: block;

    span {
      vertical-align: sub;
    }
  }

  &:focus-within {
    border: 0.05rem solid $secondary_color;
  }

  input,
  input ~ .input-group-append > span.append__ae {
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
