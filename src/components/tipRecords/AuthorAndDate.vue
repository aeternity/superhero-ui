<template>
  <div
    class="author-and-date"
    @click.stop
  >
    <Author :address="address" />
    <span class="right">
      <FormatDate v-bind="$attrs" />
      <slot />
    </span>
  </div>
</template>

<script>
import Author from './Author.vue';
import FormatDate from './FormatDate.vue';

export default {
  components: { Author, FormatDate },
  props: {
    address: { type: String, required: true },
  },
  data: () => ({ hover: false, name: null }),
};
</script>

<style lang="scss" scoped>
.author-and-date {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.9rem;

  .author {
    min-width: 0;
    margin-right: 1rem;
  }

  .right {
    font-size: 0.65rem;
    color: $light_font_color;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
}
</style>
