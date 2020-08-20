<template>
  <div class="message-input">
    <Avatar :address="address" />
    <div class="arrow" />
    <div class="text-box">
      <textarea
        ref="input"
        v-bind="$attrs"
        rows="1"
        v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value),
        }"
      />
      <button
        v-if="showSubmitButton"
        :title="submitButtonTitle"
      >
        <img src="../assets/backArrow.svg">
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import autosize from 'autosize';
import Avatar from './Avatar.vue';

export default {
  components: { Avatar },
  props: {
    showSubmitButton: Boolean,
    submitButtonTitle: { type: String, default: '' },
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
    border: 0.05rem solid $secondary_color;
    border-top: none;
    border-right: none;
  }

  .arrow {
    flex-shrink: 0;
    height: 0.8rem;
    width: 0.8rem;
    background-color: $buttons_background;
    transform: rotate(45deg);
    border-bottom-left-radius: 0.2rem;
    margin-top: 0.6rem;
    margin-left: 0.6rem;
    margin-right: -0.4rem;
  }

  .text-box {
    flex-grow: 1;
    background-color: $buttons_background;
    display: flex;
    border: 0.05rem solid transparent;
    border-radius: 0.25rem;

    &:focus-within {
      border-color: $secondary_color;
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
      height: 2.1rem;
      font-size: 0.75rem;
      line-height: 1.25rem;
      padding: 0.375rem 0.25rem 0.375rem 0.75rem;
      resize: none;

      &::placeholder {
        color: #6c757c;
      }
    }

    button {
      padding-right: 0.25rem;

      img {
        width: 0.8rem;
        transform: rotate(180deg);
        vertical-align: baseline;
      }
    }
  }
}
</style>
