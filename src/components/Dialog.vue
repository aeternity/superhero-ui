<template>
  <!-- TODO: rename to Modal, Modal rename to Popup or so -->
  <div
    class="dialog"
    @click.self="$emit('close')"
  >
    <div class="content">
      <div
        v-if="$slots.icon"
        class="icon"
      >
        <slot name="icon" />
      </div>
      <h1>{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
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

    @include smallest {
      width: 100%;
      padding: 1rem;
    }

    .icon {
      img, svg {
        height: 2rem;
        margin-bottom: 0.85rem;
      }
    }

    h1 {
      color: $standard_font_color;
      font-size: 1rem;
      font-weight: 500;
    }
  }
}
</style>
