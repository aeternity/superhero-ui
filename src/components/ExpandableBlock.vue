<template>
  <div class="expandable-block">
    <input
      :id="_uid"
      type="checkbox"
    >
    <label
      :for="_uid"
      class="heading"
    >
      <IconRightArrow />
      {{ title }}
    </label>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
import IconRightArrow from '../assets/iconRightArrow.svg?icon-component';

export default {
  components: { IconRightArrow },
  props: {
    title: { type: String, required: false, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.expandable-block {
  margin-bottom: 1rem;

  input {
    display: none;

    &:checked ~ {
      .heading {
        color: $standard_font_color;

        .iconRightArrow {
          transform: rotate(90deg);
          color: $custom_links_color;
        }
      }

      .body {
        display: block;
      }
    }
  }

  .heading {
    cursor: pointer;
    color: $custom_links_color;
    font-size: 0.9rem;
    margin-bottom: 0;

    .iconRightArrow {
      height: 1rem;
      margin-right: 0.2rem;
      vertical-align: middle;
    }
  }

  .body {
    display: none;
    color: $text_content_color;
    font-size: 0.8rem;
    margin-top: 0.5rem;

    p {
      text-align: left;
    }

    a {
      color: $custom_links_color;

      &:hover {
        filter: saturate(0.5) brightness(1.2);
      }
    }
  }
}
</style>
