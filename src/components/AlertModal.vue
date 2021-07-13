<template>
  <div
    class="alert-modal"
    @click.self="resolve"
  >
    <div class="content">
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
      <AeButton @click="resolve">
        {{ primaryButtonText }}
      </AeButton>
    </div>
  </div>
</template>

<script>
import SuccessIcon from '../assets/verifiedUrl.svg';
import FailureIcon from '../assets/iconError.svg';
import AeButton from './AeButton.vue';

export default {
  components: { AeButton },
  props: {
    title: { type: String, required: true },
    body: { type: [String, Array], required: true },
    resolve: { type: Function, required: true },
    failure: Boolean,
    hideIcon: Boolean,
    primaryButtonText: {
      type: String,
      default() { return this.$t('done'); },
    },
  },
  data: () => ({
    SuccessIcon,
    FailureIcon,
  }),
};
</script>

<style lang="scss" scoped>
.alert-modal {
  position: fixed;
  z-index: 9998;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);

  .content {
    text-align: center;
    width: 25rem;
    margin: auto;
    padding: 2.5rem;
    background-color: $actions_ribbon_background_color;
    border-radius: 0.25rem;
    border: 1px solid $card_border_color;
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
  }
}
</style>
