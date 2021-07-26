<template>
  <ButtonPlain
    class="button-dropdown"
    type="button"
    :class="{ active }"
    @click="clickHandler"
  >
    <slot />
    <img src="../assets/caretDown.svg">
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: { ButtonPlain },
  data: () => ({ active: false }),
  methods: {
    async clickHandler(event) {
      if (!this.$listeners.click) return;
      this.active = true;
      await this.$listeners.click(event);
      this.active = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.button-dropdown {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  color: $standard_font_color;
  border-radius: 2.5rem;

  &.active {
    background-color: $article_content_color;
  }

  img {
    height: 24px;
  }
}
</style>
