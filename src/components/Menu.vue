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

  > .button-plain {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.5rem 0 0.5rem;

    &:last-child {
      padding-bottom: 0.5rem;
    }

    &:hover {
      color: $standard_font_color;
    }
  }
}
</style>
