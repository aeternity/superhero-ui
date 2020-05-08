<template>
  <div>
    <MobileNavigation v-bind="$attrs" />
    <RightSection />
    <LeftSection />
    <slot />
  </div>
</template>

<script>
import LeftSection from './LeftSection.vue';
import RightSection from './RightSection.vue';
import MobileNavigation from './MobileNavigation.vue';

export default {
  components: {
    LeftSection,
    RightSection,
    MobileNavigation,
  },
};
</script>
