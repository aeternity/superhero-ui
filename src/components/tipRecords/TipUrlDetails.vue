<template>
  <div class="tip-url-details">
    <div class="source">
      {{ source }}
    </div>
    <h2
      class="title text-ellipsis"
      :title="title"
    >
      {{ title }}
    </h2>
    <div
      class="description"
      :title="description"
    >
      {{ description }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    source: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.tip-url-details {
  padding: 0.5rem;

  .source {
    font-size: 0.5rem;
    color: $light_font_color;
    margin-bottom: 0.15rem;
    text-transform: uppercase;
    line-height: 1.1rem;
  }

  .title {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0 0 0.15rem 0;
    color: $tip_note_color;
    line-height: 0.9rem;
  }

  .description {
    @include truncate-overflow-mx(1);

    font-size: 0.7rem;
    color: $tip_note_color;
    line-height: 1.1rem;
  }
}
</style>
