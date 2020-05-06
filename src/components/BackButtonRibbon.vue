<template>
  <div class="actions-ribbon">
    <img
      src="../assets/backArrow.svg"
      @click="$router.go(-1)"
    >
  </div>
</template>

<script>
export default {
  name: 'BackButtonRibbon',
};
</script>

<style lang="scss" scoped>
.actions-ribbon {
  padding: 1.05rem 2.5rem 1.05rem 1rem;
  background-color: $article_content_color;
  position: sticky;
  top: 0;
  line-height: 0.75rem;
  z-index: 21;

  img {
    width: 1rem;
    height: 1rem;

    &:hover {
      cursor: pointer;
    }
  }
}

@media (max-width: 991px) {
  .actions-ribbon {
    display: none;
  }
}
</style>
