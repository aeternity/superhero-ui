<template>
  <div
    class="modal-mask"
    @click.stop="resolve"
  >
    <div class="modal-wrapper">
      <div class="success-modal">
        <img
          v-if="!hideIcon"
          :src="failure ? FailureIcon : SuccessIcon"
        >
        <h1>{{ title }}</h1>
        <p
          v-for="(row, index) in body instanceof Array ? body : [body]"
          :key="index"
        >
          {{ row }}
        </p>
        <button
          class="button"
          @click="resolve"
        >
          {{ primaryButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessIcon from '../assets/verifiedUrl.svg';
import FailureIcon from '../assets/iconError.svg';

export default {
  props: {
    title: { type: String, required: true },
    body: { type: [String, Array], required: true },
    resolve: { type: Function, required: true },
    failure: { type: Boolean },
    hideIcon: { type: Boolean },
    primaryButtonText: {
      type: String,
      default() { return this.$t('done'); },
    },
  },
  data() {
    return {
      SuccessIcon,
      FailureIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  vertical-align: middle;
  padding-top: 5rem;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  background-color: rgba(0, 0, 0, 0.5);

  .success-modal {
    text-align: center;
    width: 25rem;
    margin: 0 auto;
    padding: 2.5rem 2.5rem;
    background-color: #090909;
    border-radius: 0.25rem;
    border: 1px solid #2f2f2f;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
    word-break: break-word;

    @include smallest {
      width: 100%;
      padding: 1rem;
    }

    img {
      height: 2rem;
      margin-bottom: 0.85rem;
    }

    h1 {
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 500;
    }

    .button {
      background-color: #1161fe;
      border: none;
      border-radius: 0.25rem;
      color: $standard_font_color;
      font-size: 0.75rem;
      font-weight: 700;
      justify-self: center;
      line-height: 1.125;
      padding: 0.65rem 1rem;
    }
  }
}
</style>
