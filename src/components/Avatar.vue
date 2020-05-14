<!-- eslint-disable vue/no-v-html -->
<template>
  <img
    v-if="!error && avatar"
    :src="avatar"
    loading="lazy"
    @error="error = true"
  >
  <img
    v-else
    class="user-identicon"
    :src="identicon"
  >
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import Backend from '../utils/backend';

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
      const avatars = new Avatars(sprites, { eyes: ['happy', 'surprised'], base64: true });
      return avatars.create(this.address);
    },
  },
};
</script>

<style>
.user-identicon {
  display: inline-block;
}
</style>
