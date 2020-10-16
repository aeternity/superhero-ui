<template>
  <div
    class="tip__two-columns-preview"
    @click.stop="goToTip"
  >
    <div class="tip__two-columns-img">
      <img :src="tipPreviewImage">
    </div>

    <div class="tip__two-columns-info">
      <div class="source">
        {{ sourceUrl.toUpperCase() }}
      </div>
      <h2
        class="title text-ellipsis"
        :title="tipPreviewTitle"
      >
        {{ tipPreviewTitle }}
      </h2>
      <div
        class="description"
        :title="tipPreviewDescription"
      >
        {{ tipPreviewDescription }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tip: { type: Object, required: true },
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
    tipPreviewImage: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    goToTip: { type: Function, default: () => {} },
  },
};
</script>

<style lang="scss" scoped>
.description {
  @include truncate-overflow-mx(6);
}

@media only screen and (max-width: 1024px) {
  .description {
    @include truncate-overflow-mx(2);
  }
}
</style>
