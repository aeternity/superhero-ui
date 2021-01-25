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
import jdenticon from 'jdenticon';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import { IDENTICON_CONFIG, AVATAR_CONFIG } from '../utils';

jdenticon.config = IDENTICON_CONFIG;

export default {
  props: {
    address: { type: String, default: '' },
    showIdenticonOnly: { type: Boolean },
  },
  data: () => ({
    error: false,
    profileImageUrl: '',
  }),
  computed: mapState({
    profileIdenticonUrl({ chainNames }) {
      const name = chainNames[this.address];
      return name
        ? new Avatars(sprites, AVATAR_CONFIG).create(name)
        : `data:image/svg+xml;base64,${btoa(jdenticon.toSvg(this.address, 32))}`;
    },
  }),
  async created() {
    const key = this.profile?.signature?.slice(0, 5);
    this.profileImageUrl = `${await this.$store.dispatch('backend/getProfileImageUrl', this.address)}?${key || ''}`;
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
