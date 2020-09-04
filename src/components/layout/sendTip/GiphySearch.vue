<template>
  <div class="giphy-search">
    <SearchInput
      v-model="query"
      placeholder="Search GIPHY"
      sided
      @input="newSearch"
    />
    <div
      v-if="resultsCount"
      class="results-count"
    >
      {{ resultsCount }}
    </div>
    <div
      class="results"
      @scroll="loadMore($event.target)"
    >
      <div
        v-for="(item, colIndex) in Array(3)"
        :key="colIndex"
        class="gif-column"
      >
        <div
          v-for="({ still, animated, original }, index) in results"
          :key="index"
        >
          <img
            v-if="index % 3 === colIndex"
            :src="hovered === index ? animated : still"
            @mouseover="hovered = index"
            @mouseleave="hovered = null"
            @click="$emit('add-gif', original)"
          >
        </div>
      </div>
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<script>
import Loading from '../../Loading.vue';
import SearchInput from '../SearchInput.vue';

export default {
  components: {
    Loading,
    SearchInput,
  },
  data() {
    return {
      query: '',
      results: [],
      offset: 0,
      resultsCount: '',
      loading: false,
      hovered: null,
      focused: false,
    };
  },
  mounted() { this.newSearch(); },
  methods: {
    newSearch() {
      this.resultsCount = '';
      this.loading = true;
      this.results = [];
      this.offset = 0;
      this.search();
    },
    async search() {
      try {
        const results = await fetch(`https://api.giphy.com/v1/gifs/${this.query ? `search?q=${this.query}&` : 'trending?'}api_key=${process.env.VUE_APP_GIPHY_API_KEY}&limit=10&offset=${this.offset}`);
        const { data, pagination } = await results.json();
        this.resultsCount = `${pagination.total_count.toLocaleString()} Results`;
        this.results.push(...data.map(({ images }) => ({
          still: images.fixed_width_still.url,
          animated: images.fixed_width.url,
          original: images.original.url,
        })));
      } finally { this.loading = false; }
    },
    loadMore(element) {
      const { clientHeight, scrollTop, scrollHeight } = element;
      if (clientHeight + scrollTop >= scrollHeight - 1 && this.loading === false) {
        this.loading = true;
        this.offset += 10;
        this.search();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.giphy-search {
  position: relative;
  margin: 0.5rem;

  .loading {
    position: absolute;
    bottom: 0;
  }
}

.search-input {
  border-radius: 0.25rem 0.25rem 0 0;
}

.results-count {
  background: $light_color;
  text-align: right;
}

.results {
  height: 20rem;
  display: flex;
  overflow-y: scroll;
  flex-wrap: no-wrap;
  scrollbar-color: $light_font_color $actions_ribbon_background_color;
  scrollbar-width: thin;

  img {
    background-color: $article_content_color;
    padding: 0.2rem;
    width: 100%;
    height: auto;
    cursor: pointer;

    &:hover {
      filter: brightness(1.3);
    }
  }

  button {
    height: 2rem;
    flex-grow: 0;
  }

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background: $light_font_color;
    border-radius: 0.25rem;
  }
}
</style>