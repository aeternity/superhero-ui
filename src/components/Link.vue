<template>
  <RouterLink
    v-if="isLinkOnSameHost"
    class="link"
    :to="to"
  >
    <slot />
  </RouterLink>
  <a
    v-else
    class="link"
    :href="to"
    target="_self"
    @click="$emit('click', $event)"
  >
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    to: { type: [String, Object], required: true },
  },
  computed: {
    isLinkOnSameHost() {
      return typeof this.to === 'object'
        || (new URL(this.to, window.location)).host === window.location.host;
    },
  },
};
</script>
