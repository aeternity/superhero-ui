<template>
  <div
    class="dropdown"
    :class="{ right: showRight, 'read-only': !method }"
  >
    <ButtonDropdown
      :class="{ active: showMenu }"
      @click.native.prevent="showMenu = true"
    >
      <slot
        name="displayValue"
        :displayValue="currentValue"
      />
      <span v-if="!$slots.displayValue">{{ displayValue }}</span>
    </ButtonDropdown>
    <Modal
      v-if="showMenu"
      @close="showMenu = false"
    >
      <Component
        :is="method ? 'ButtonPlain' : 'div'"
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click="selectItem(option)"
      >
        <slot :option="option">
          {{ option.text }}
        </slot>
      </Component>
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue';
import ButtonDropdown from './ButtonDropdown.vue';
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: {
    Modal,
    ButtonDropdown,
    ButtonPlain,
  },
  props: {
    options: { type: Array, required: true },
    selected: { type: [String, Number], default: '' },
    method: { type: Function, default: null },
    showRight: Boolean,
  },
  data() {
    return {
      showMenu: false,
      currentValue: this.options[0],
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
  methods: {
    selectItem(option) {
      if (this.method) {
        this.currentValue = option;
        this.method(option);
      }
      this.showMenu = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;
  vertical-align: middle;

  > .button-dropdown {
    display: flex;
  }

  .dropdown-item {
    font-size: 0.75rem;
    min-width: 6.5rem;
    padding: 0.4rem 0.8rem;
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;
    box-shadow: inset 0 0 0.1rem $article_content_color;
    border-radius: unset;
    white-space: nowrap;

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

  ::v-deep button {
    padding: 0;
  }

  &::v-deep .modal-content {
    max-height: 10rem;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      scrollbar-width: none;
      display: none;
    }
  }

  &.right::v-deep .modal-content {
    right: 0;
  }

  &.read-only .dropdown-item {
    cursor: initial;

    &:hover {
      background-color: $actions_ribbon_background_color;
    }
  }
}
</style>
