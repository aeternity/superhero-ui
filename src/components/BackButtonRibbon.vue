<template>
  <div class="actions-ribbon">
    <ButtonPlain
      class="back-button"
      @click="back"
    >
      <BackArrow v-if="!hideBack" />
    </ButtonPlain>

    <div class="title">
      <slot name="title" />
    </div>

    <div class="buttons">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';
import BackArrow from '../assets/backArrow.svg?icon-component';

export default {
  components: {
    ButtonPlain,
    BackArrow,
  },
  props: {
    hideBack: { type: Boolean },
  },
  methods: {
    back() {
      if (!this.$store.state.route.from.name) {
        this.$router.push({ name: 'feed' });
        return;
      }
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.actions-ribbon {
  padding: 0.6rem 1.05rem;
  background-color: $actions_ribbon_background_color;
  position: sticky;
  top: 0;
  line-height: 1.2rem;
  height: 56px;
  z-index: 21;
  display: flex;

  .back-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: $standard_font_color;
    opacity: 0.7;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }

    svg {
      width: 24px;
    }
  }

  .title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
  }

  .buttons {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

@media (max-width: 991px) {
  .actions-ribbon {
    display: none;
  }
}
</style>
