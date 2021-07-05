<template>
  <div
    class="three-dots-menu"
    :class="{ active: showMenu }"
    @click="showMenu = true"
  >
    •••
    <Modal
      v-if="showMenu"
      @close="showMenu = false"
    >
      <slot />
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      showMenu: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.three-dots-menu {
  position: relative;
  padding: 0;
  border-radius: 0.25rem;

  &.active {
    background-color: $light_color;
  }

  &:hover {
    cursor: pointer;
    color: #fff;
  }

  ::v-deep .modal-content {
    font-size: 0.75rem;
    border-radius: 0.25rem;
    border: 0.05rem solid $article_content_color;
    color: $border_color;
    background-color: $actions_ribbon_background_color;
    padding: 0.5rem;
    top: 1.2rem;
    right: 0;
    white-space: nowrap;

    & > div {
      padding-bottom: 0.5rem;

      &:last-child {
        padding-bottom: 0;
      }

      &:hover {
        cursor: pointer;
        color: $standard_font_color;
      }
    }
  }
}
</style>
