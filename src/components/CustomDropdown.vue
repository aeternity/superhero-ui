<template>
  <div
    class="dropdown"
    :class="{ right: showRight, 'read-only': !method }"
  >
    <button
      :class="{ active: showMenu }"
      @click.prevent="showMenu = true"
    >
      <slot
        name="diplayValue"
      />
      <span v-if="!$slots.diplayValue">{{ displayValue }}</span>
      <img src="../assets/carretDown.svg">
    </button>
    <Modal
      v-if="showMenu"
      @close="showMenu = false"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click="method ? method(option) : null, showMenu = false"
      >
        <slot :option="option">
          {{ option.text }}
        </slot>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  props: {
    options: { type: Array, default: null },
    selected: { type: [String, Number] },
    method: { type: Function },
    showRight: { type: Boolean },
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    displayValue() {
      if (!this.selected) {
        return this.options[0].text || '';
      }
      const selectedOption = this.options.find((option) => option.value === this.selected);
      return selectedOption ? selectedOption.text : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  button {
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
    color: $standard_font_color;
    outline: none;
    border-radius: 2.5rem;

    &.active {
      background-color: $article_content_color;
    }
  }

  .dropdown-item {
    font-size: 0.75rem;
    min-width: 6.5rem;
    padding: 0.6rem 0.8rem;
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;
    box-shadow: inset 0 0 0.1rem $article_content_color;
    cursor: pointer;

    &:first-child {
      border-radius: 0.15rem 0.15rem 0 0;
    }

    &:last-child {
      border-radius: 0 0 0.15rem 0.15rem;
    }

    &:hover {
      background-color: $background_color;
    }
  }

  &.right ::v-deep .not-bootstrap-modal-content {
    right: 0;
    max-height: 10rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      scrollbar-width: none;
      display: none;
    }
  }

  &.read-only .dropdown-item {
    cursor: initial;

    &:hover {
      background-color: $actions_ribbon_background_color;
    }
  }
}
</style>
