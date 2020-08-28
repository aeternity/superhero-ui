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
export default {
  props: {
    to: { type: [String, Object, URL], required: true },
  },
  computed: {
    isLinkOnSameHost() {
      return (typeof this.to === 'object' && !(this.to instanceof URL))
        || (new URL(this.to, window.location)).host === window.location.host;
    },
    routerLinkTo() {
      return this.to instanceof URL ? this.to.toString() : this.to;
    },
  },
};
</script>
