<template>
  <img
    class="avatar"
    :src="showIdenticonOnly || error ? profileIdenticonUrl : profileImageUrl"
    loading="lazy"
    @error="error = true"
  >
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';

export default {
  props: {
    address: { type: String, default: '' },
    showIdenticonOnly: { type: Boolean },
  },
  data: () => ({
    error: false,
  }),
  computed: mapState({
    profileIdenticonUrl({ chainNames }) {
      const name = chainNames[this.address];
      return `https://avatars.z52da5wt.xyz/${name || this.address}`;
    },
    profileImageUrl({ address, profile }) {
      const key = address === this.address && profile?.signature?.slice(0, 5);
      return `${Backend.getProfileImageUrl(this.address)}${key ? `?cacheBust=${key}` : ''}`;
    },
  },
  watch: {
    profileImageUrl() {
      this.error = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  object-fit: cover;
}
</style>
