<template>
  <!-- TODO: Get rid of this component by inlining loader and back button to pages -->
  <Loading
    v-if="loading"
    class="page-loader"
  />
  <div v-else>
    <BackButtonRibbon v-if="back" />
    <slot />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from '../Loading.vue';
import BackButtonRibbon from '../BackButtonRibbon.vue';

export default {
  components: {
    Loading,
    BackButtonRibbon,
  },
  props: {
    back: { type: Boolean },
  },
  computed: mapState({
    loading: ({ loading: { initial } }) => initial,
  }),
};
</script>

<style lang="scss" scoped>
.page-loader {
  margin: 5rem;
}
</style>
