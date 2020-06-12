<template>
  <div
    class="modal-mask"
    @click.stop="$emit('close')"
  >
    <div class="modal-wrapper">
      <div class="success-modal">
        <img :src="SuccessIcon">
        <h1>{{ title }}</h1>
        <p>{{ body }}</p>
        <button
          class="button"
          @click="$emit('close')"
        >
          {{ primaryButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessIcon from '../assets/verifiedUrl.svg';

export default {
  props: {
    title: { type: String, required: true },
    body: { type: String, required: true },
    primaryButtonText: {
      type: String,
      default() { return this.$t('done'); },
    },
  },
  data() {
    return {
      SuccessIcon,
    };
  },
};
</script>

<style lang="scss">
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
    background-color: $actions_ribbon_background_color;
    border-radius: 0.5rem;
    box-shadow: 0 0.1rem 0.4rem rgba(0, 0, 0, 0.33);

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
      width: 10rem;
      background-color: inherit;
      border: 1px solid $secondary_color;
      border-radius: 0.25rem;
      color: $secondary_color;
      font-size: 0.75rem;
      font-weight: 700;
      justify-self: center;
      line-height: 1.125;
      padding: 0.65rem 1rem;
    }
  }
}
</style>
