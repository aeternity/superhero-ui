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
      query: this.$route.query.search || '',
    };
  },
  methods: {
    search() {
      this.$router[this.$route.name === 'feed' ? 'replace' : 'push']({
        name: 'feed', query: { search: this.query },
      });
    },
  },
};
</script>
