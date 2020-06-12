<template>
  <div
    class="three-dots"
    :class="{ active: showMenu }"
    @click="showMenu = true"
  >
    <!--eslint-disable-line vue-i18n/no-raw-text-->
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
.three-dots {
  position: relative;
  padding: 0 0.25rem;
  border-radius: 0.25rem;

  &.active {
    background-color: $light_color;
  }

  &:hover {
    cursor: pointer;
    color: #fff;
  }

  /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
  ::v-deep .modal-content {
    font-size: 0.75rem;
    border-radius: 0.25rem;
    border: 0.05rem solid $article_content_color;
    color: $border_color;
    background-color: $actions_ribbon_background_color;
    padding: 0.5rem;
    top: 1.2rem;
    right: 0;
    width: fit-content;
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
