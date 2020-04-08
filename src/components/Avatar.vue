<!-- eslint-disable-next-line vue/no-v-html -->
<template>
  <img
    v-if="!error && avatar"
    :src="avatar"
    loading="lazy"
    @error="error = true"
  >
  <div
    v-else
    class="user-identicon"
    v-html="identicon"
  />
</template>

<script>
import jdenticon from 'jdenticon';
import Backend from '../utils/backend';
import { IDENTICON_CONFIG } from '../utils/util';

export default {
  props: {
    address: {
      type: [String, Object],
      default: null,
    },
  },
  data: () => ({
    error: false,
  }),
  computed: {
    avatar() {
      const userImage = Backend.getProfileImageUrl(this.address);
      return this.address ? userImage : null;
    },
    identicon() {
      jdenticon.config = IDENTICON_CONFIG;
      return jdenticon.toSvg(this.address, 32);
    },
  },
};
</script>

<style>
.user-identicon {
  display: inline-block;
}
</style>
