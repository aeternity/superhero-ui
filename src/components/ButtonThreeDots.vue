<template>
  <ButtonPlain
    class="button-three-dots"
    :class="{ active }"
    @click="clickHandler"
  >
    •••
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
.button-three-dots {
  &.active,
  &:hover {
    color: #fff;
  }
}
</style>
