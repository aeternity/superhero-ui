<!-- eslint-disable vue/no-v-html -->
<template>
  <img
    v-if="!error && profileImageUrl"
    class="user-identicon"
    :src="profileImageUrl"
    loading="lazy"
    @error="error = true"
  >
  <img
    v-else-if="avatar.type === 'avatar'"
    class="user-identicon"
    :src="avatar.src"
  >
  <div
    v-else-if="avatar.type === 'identicon'"
    class="user-identicon"
    v-html="avatar.src"
  />
</template>

<script>
import { mapState } from 'vuex';
import jdenticon from 'jdenticon';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import Backend from '../utils/backend';
import { IDENTICON_CONFIG, AVATAR_CONFIG } from '../utils/util';

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
    ...mapState(['chainNames']),
    avatar() {
      if (this.chainNames[this.address]) {
        const avatars = new Avatars(sprites, AVATAR_CONFIG);
        return {
          type: 'avatar',
          src: avatars.create(this.chainNames[this.address]),
        };
      }

      jdenticon.config = IDENTICON_CONFIG;
      return {
        type: 'identicon',
        src: jdenticon.toSvg(this.address, 32),
      };
    },
    profileImageUrl() {
      const imageSignature = this.$store.state.account === this.address && this.$store.state.profile
        ? this.$store.state.profile.signature
        : '';
      const key = imageSignature && imageSignature.slice(0, 5);
      return `${Backend.getProfileImageUrl(this.address)}?${key}`;
    },
  },
  watch: {
    profileImageUrl() {
      this.error = false;
    },
  },
};
</script>

<style>
.user-identicon {
  display: inline-block;
}
</style>
