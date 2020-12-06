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
      const currentLocation = process.env.VUE_CLI_SSR ? 'http://superhero.com' : window.location;
      const currentLocationHost = process.env.VUE_CLI_SSR ? 'superhero.com' : window.location.host;
      return (typeof this.to === 'object' && !(this.to instanceof URL))
        || (new URL(this.to, currentLocation)).host === currentLocationHost;
    },
    routerLinkTo() {
      return this.to instanceof URL ? this.to.toString() : this.to;
    },
  },
};
</script>
