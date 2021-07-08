<template>
  <a
    class="twitter-embed"
    :href="tipUrl"
    target="_blank"
  >
    <img :src="tipPreviewImage">

    <TipUrlDetails
      :source="sourceUrl"
      :title="tipPreviewTitle"
      :description="tipPreviewDescription"
    />
  </a>
</template>

<script>
import TipUrlDetails from './TipUrlDetails.vue';

export default {
  components: { TipUrlDetails },
  props: {
    tipPreviewTitle: { type: String, required: true },
    tipPreviewDescription: { type: String, required: true },
    tipPreviewImage: { type: String, required: true },
    tipUrl: { type: String, required: true },
    sourceUrl: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.twitter-embed {
  display: flex;

  img {
    width: 35%;
    object-fit: cover;
  }

  .tip-url-details ::v-deep .description {
    @include truncate-overflow-mx(6);

    @include mobile {
      @include truncate-overflow-mx(3);
    }
  }
}
</style>
