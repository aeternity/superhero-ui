<template>
  <Modal
    class="menu"
    @close="$emit('close')"
  >
    <slot />
  </Modal>
</template>

<script>
import Modal from './Modal.vue';

export default {
  components: { Modal },
};
</script>

<style lang="scss" scoped>
.menu ::v-deep .modal-content {
  font-size: 0.75rem;
  border-radius: 0.25rem;
  border: 0.05rem solid $article_content_color;
  color: $border_color;
  background-color: $actions_ribbon_background_color;

  > .button-plain,
  > div {
    padding: 0.25rem 0.5rem;

    &:first-child {
      padding-top: 0.5rem;
    }

    &:last-child {
      padding-bottom: 0.5rem;
    }
  }

  > .button-plain {
    display: block;
    width: 100%;
    text-align: left;

    &:hover {
      color: $standard_font_color;
      background-color: $background_color;
    }
  }
}
</style>
