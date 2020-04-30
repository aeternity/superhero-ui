<template>
  <div
    class="expand-block"
    :class="{ expanded: expanded }"
  >
    <div
      class="heading"
      @click="toggleExpand(!expanded)"
    >
      <img
        :src="iconDrawer"
        class="arrow"
      >
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div
      v-if="expanded"
      class="body"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import iconDrawer from '../assets/iconDrawer.svg';

export default {
  name: 'ExpandableBlock',
  props: {
    title: { type: String, required: false, default: '' },
  },
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
    font-size: 0.8rem;
    margin-top: 0.5rem;

    p {
      text-align: left;
    }
  }

  .title {
    color: $custom_links_color;
    font-size: 0.9rem;
    font-weight: 400;
  }

  .arrow {
    margin-right: 0.5rem;
    vertical-align: middle;
  }

  &.expanded {
    .arrow {
      transform: rotate(90deg);
    }

    .title {
      color: $standard_font_color;
    }
  }

  a {
    color: $custom_links_color;

    &:hover {
      filter: saturate(0.5) brightness(1.2);
    }
  }

  .heading:hover {
    cursor: pointer;
  }
}
</style>
