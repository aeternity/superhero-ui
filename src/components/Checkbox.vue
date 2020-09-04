<template>
  <label class="checkbox">
    <span class="text">
      <slot />
    </span>
    <input
      :checked="checked"
      type="checkbox"
      @change="$emit('change')"
    >
    <span class="checkmark" />
  </label>
</template>

<script>
export default {
  props: {
    checked: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  padding-left: 1.3rem;
  cursor: pointer;
  font-size: 0.75rem;
  user-select: none;
  margin-bottom: 0;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0.15rem;
  left: 0;
  height: 0.9rem;
  width: 0.9rem;
  background-color: $article_content_color;
  border-radius: 0.15rem;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox input:checked ~ .checkmark::after {
  display: block;
}

.checkbox .checkmark::after {
  left: 0.3rem;
  top: 0.1rem;
  width: 0.3rem;
  height: 0.55rem;
  border: solid $custom_links_color;
  border-width: 0 0.08rem 0.08rem 0;
  transform: rotate(45deg);
}
</style>
