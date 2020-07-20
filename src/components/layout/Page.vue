<template>
  <div class="page">
    <MobileNavigation />
    <RightSection />
    <LeftSection />
    <Loading
      v-if="loading"
      class="initial-loading"
    />
    <div v-else>
      <BackButtonRibbon v-if="back" />
      <slot />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from '../Loading.vue';
import BackButtonRibbon from '../BackButtonRibbon.vue';

export default {
  components: {
    LeftSection,
    RightSection,
    MobileNavigation,
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
.page {
  /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
  ::v-deep .loading-position-absolute {
    position: absolute;
  }

  .initial-loading {
    margin-top: 5rem;
  }

  .content {
    color: $primary_color;
    min-height: 4rem;
    margin-top: 0.5rem;
  }

  @media only screen
    and (min-device-width: 320px)
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2) {
    .content {
      padding: 1rem;
    }
  }
}
</style>
