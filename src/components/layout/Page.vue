<template>
  <Loading v-if="loading" />
  <div
    v-else
    class="page"
  >
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
/* stylelint-disable-next-line selector-pseudo-element-no-unknown */
.page ::v-deep .loading-position-absolute {
  position: absolute;
}

.loading {
  margin-top: 5rem;
}
</style>
