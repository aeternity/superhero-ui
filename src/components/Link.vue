<template>
  <RouterLink
    v-if="isLinkOnSameHost"
    class="link"
    :to="routerLinkTo"
  >
    <slot />
  </RouterLink>
  <a
    v-else
    class="link"
    :href="to"
    target="_blank"
    @click="$emit('click', $event)"
  >
    <slot />
  </a>
</template>

<script>
import { pickBy } from 'lodash-es';

export default {
  props: {
    to: { type: [String, Object, URL], default: null },
    toRelative: { type: Object, default: null },
  },
  computed: {
    isLinkOnSameHost() {
      return (typeof this.to === 'object' && !(this.to instanceof URL))
        || (new URL(this.to, this.$location)).host === this.$location.host;
    },
    routerLinkTo() {
      if (this.toRelative) {
        return {
          ...this.$route,
          query: pickBy({ ...this.$route.query, ...this.toRelative.query }),
          params: pickBy({ ...this.$route.params, ...this.toRelative.params }),
        };
      }
      if (this.to instanceof URL) return this.to.toString();
      return this.to;
    },
  },
};
</script>
