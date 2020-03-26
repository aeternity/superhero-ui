<template>
  <div
    class="expand-block"
    :class="{ expanded: expanded }"
    ,@click="toggleExpand(!expanded)"
  >
    <img
      :src="iconDrawer"
      class="arrow"
    >
    <div
      class="title"
      v-html="title"
    />
    <div
      v-if="expanded"
      class="body"
      v-html="body"
    />
  </div>
</template>

<script>
import iconDrawer from '../assets/iconDrawer.svg';

export default {
  name: 'ExpandBlock',
  props: ['title', 'body'],
  data() {
    return {
      expanded: false,
      iconDrawer,
    };
  },
  methods: {
    toggleExpand(isExpanded) {
      this.expanded = isExpanded;
    },
  },
};
</script>

<style lang="scss">
.expand-block {
  margin-bottom: 1rem;

  .body {
    color: $text_content_color;
    font-size: .8rem;
    margin-top: .5rem;

    p{
      text-align: left;
    }
  }

  .title {
    color: $custom_links_color;
    font-size: .9rem;
    font-weight: 400;
    font-weight: 400;
  }

  &:hover {
    cursor: pointer;
  }

  &.expanded {
    .arrow {
        transform: rotate(90deg)
    }

    .title {
      color: $standard_font_color;
    }
  }

  .arrow {
    margin-right: .5rem;
    vertical-align: middle;
  }
  a {
    color: $custom_links_color;

    &:hover {
      filter: saturate(0.5) brightness(1.2);
    }
  }
}
</style>
