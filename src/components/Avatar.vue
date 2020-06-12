<!-- eslint-disable vue/no-v-html -->
<template>
  <img
    v-if="!error && profileImage"
    class="user-identicon"
    :src="profileImage"
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
import { IDENTICON_CONFIG, AVATAR_CONFIG } from '../utils/util';

export default {
  props: {
    address: {
      type: [String, Object],
      default: null,
    },
    profileImage: {
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
  },
  watch: {
    profileImage() {
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
