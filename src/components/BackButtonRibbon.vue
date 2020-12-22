<template>
  <div class="actions-ribbon">
    <ButtonPlain
      class="back-button"
      @click="back"
    >
      <img src="../assets/backArrow.svg">
    </ButtonPlain>

    <div class="title">
      {{ title }}
    </div>

    <div class="buttons">
      <slot />
    </div>
  </div>
</template>

<script>
import ButtonPlain from './ButtonPlain.vue';

export default {
  components: {
    ButtonPlain,
  },
  props: {
    title: { type: String, default: '' },
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
  background-color: $article_content_color;
  position: sticky;
  top: 0;
  line-height: 1.2rem;
  height: 2.8rem;
  z-index: 21;
  display: flex;

  .back-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  img {
    width: 1rem;
    height: 1rem;

    &:hover {
      cursor: pointer;
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
