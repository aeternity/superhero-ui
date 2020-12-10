<template>
  <div
    class="search-input"
    :class="{ sided, focused }"
  >
    <input
      v-model="query"
      type="text"
      :placeholder="$t('views.TipList.SearchPlaceholder')"
      @focus="focused = true"
      @blur="focused = false"
    >

    <RouterLink
      v-if="query.length"
      :title="$t('views.TipList.Clear')"
      :to="{ name: 'tips' }"
    >
      <img src="../../assets/iconEraser.svg">
    </RouterLink>
    <img
      v-else-if="sided && !focused"
      src="../../assets/iconSearch.svg"
    >

    <button
      v-if="!sided"
      :title="$t('views.TipList.CloseSearch')"
      @click="$emit('close')"
    >
      <!--eslint-disable-line vue-i18n/no-raw-text-->
      &#x2715;
    </button>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  props: {
    sided: { type: Boolean },
  },
  data: () => ({ focused: false }),
  computed: {
    query: {
      get() {
        return this.$route.params.query || '';
      },
      set: debounce(function set(query) {
        this.$router[this.$route.name.startsWith('tips') ? 'replace' : 'push']({
          name: query ? 'feed-search' : 'tips', params: { query },
        });
      }, 300),
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  background-color: $article_content_color;
  border: 0.05rem solid transparent;
  display: flex;
  align-items: center;
  font-size: 1rem;

  &.focused {
    border-color: $secondary_color;
  }

  input,
  button {
    background: none;
    border: none;
    padding: 0;
    outline: none;
    color: #fff;
  }

  input {
    flex-grow: 1;
    font-size: 0.75rem;
    color: $standard_font_color;
    padding: 1.05rem 1rem;

    ~ * {
      margin-right: 0.5rem;
    }
  }

  img {
    width: 1rem;
  }

  &.sided {
    height: 2.2rem;

    input ~ * {
      margin-right: 1rem;
    }
  }
}
</style>
