<template>
  <div class="message-input">
    <Avatar :address="address" />
    <div class="arrow" />
    <div class="text-box">
      <textarea
        ref="input"
        v-bind="$attrs"
        rows="1"
        :disabled="loading"
        v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value),
        }"
      />
      <div
        v-if="loading"
        class="spinner-border spinner-border-sm text-primary"
      />
      <button
        v-else-if="showSubmitButton"
        :title="submitButtonTitle"
      >
        <BackArrow />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import autosize from 'autosize';
import Avatar from './Avatar.vue';
import BackArrow from '../assets/backArrow.svg?icon-component';

export default {
  components: { Avatar, BackArrow },
  props: {
    showSubmitButton: Boolean,
    submitButtonTitle: { type: String, default: '' },
    loading: Boolean,
  },
  computed: mapState(['address']),
  mounted() {
    autosize(this.$refs.input);
  },
};
</script>

<style lang="scss" scoped>
.message-input {
  display: flex;

  &:focus-within .arrow {
    border: 1px solid $secondary_color;
    border-top: none;
    border-right: none;
    background-color: $background_color;
  }

  .arrow {
    flex-shrink: 0;
    height: 16px;
    width: 16px;
    background-color: $buttons_background;
    transform: rotate(45deg);
    margin-top: 12px;
    margin-left: 12px;
    margin-right: -8px;
  }

  .text-box {
    flex-grow: 1;
    background-color: $buttons_background;
    display: flex;
    border: 1px solid transparent;
    border-radius: 6px;

    &:focus-within {
      border-color: $secondary_color;
      background-color: $background_color;
    }

    textarea,
    button {
      border: none;
      background: none;
      outline: none;
      padding: 0;
    }

    textarea {
      flex-grow: 1;
      color: $standard_font_color;
      height: 38px;
      font-size: 14px;
      line-height: 22.65px;
      padding: 8.5px 16px;
      resize: none;

      &::placeholder {
        color: $light_font_color;
      }

      &:disabled {
        opacity: 0.3;
      }
    }

    button {
      padding-right: 5px;

      svg {
        transform: rotate(180deg);
        color: $standard_font_color;
        height: 24px;
        opacity: 0.7;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }
    }

    .spinner-border {
      align-self: center;
      margin: 0 8px;
    }
  }
}
</style>
