<template>
  <div class="right-section-title">
    <span><slot /></span>

    <button
      v-if="useIframeWallet"
      @click="$emit('toggle')"
    >
      <IconExpanded :class="{ open }" />
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconExpanded from '../../assets/iconExpanded.svg?icon-component';

export default {
  components: { IconExpanded },
  computed: mapState(['useIframeWallet']),
  props: { open: Boolean },
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

  button {
    color: $light_font_color;
    background: none;
    border: none;
    outline: none;
    padding: 0;

    &:hover {
      color: $lighter_font_color;
    }

    svg {
      height: 1em;
      transform: rotate(180deg);

      &.open {
        transform: rotate(0);
      }
    }
  }
}
</style>
