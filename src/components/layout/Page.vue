<template>
  <div>
    <MobileNavigation v-bind="$attrs" />
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
import LeftSection from './LeftSection.vue';
import RightSection from './RightSection.vue';
import MobileNavigation from './MobileNavigation.vue';
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
    loading: { type: Boolean },
    back: { type: Boolean },
  },
};
</script>

<style lang="scss">
  .initial-loading {
    margin-top: 5rem;
  }
</style>
