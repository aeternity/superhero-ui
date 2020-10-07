<template>
  <div class="right-section-title">
    <span><slot /></span>

    <ButtonPlain
      v-if="toggleHandler"
      @click="toggleHandler"
    >
      <IconExpanded :class="{ closed }" />
    </ButtonPlain>
  </div>
</template>

<script>
import IconExpanded from '../../assets/iconExpanded.svg?icon-component';
import ButtonPlain from '../ButtonPlain.vue';

export default {
  components: { IconExpanded, ButtonPlain },
  props: {
    closed: Boolean,
    toggleHandler: { type: Function, default: null },
  },
};
</script>

<style lang="scss" scoped>
.right-section-title {
  color: $standard_font_color;
  font-weight: 600;
  padding-bottom: 0.65rem;
  display: flex;
  justify-content: space-between;

  img {
    height: 1.2rem;
    margin-right: 0.2rem;
  }

  .button-plain {
    color: $light_font_color;

    &:hover {
      color: $lighter_font_color;
    }

    svg {
      height: 1em;

      &.closed {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
