<template>
  <SearchInput
    v-model="query"
    :placeholder="$t('views.TipList.SearchPlaceholder')"
    :sided="sided"
    @close="$emit('close')"
    @input="search"
  />
</template>

<script>
import SearchInput from './SearchInput.vue';

export default {
  components: { SearchInput },
  props: {
    sided: { type: Boolean },
  },
  data() {
    return {
      query: this.$route.params.query || '',
    };
  },
  methods: {
    search() {
      this.$router[this.$route.name.startsWith('feed') ? 'replace' : 'push']({
        name: this.query ? 'feed-search' : 'feed', params: { query: this.query },
      });
    },
  },
};
</script>
