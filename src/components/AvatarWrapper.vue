<template>
  <Avatar
    :key="componentKey"
    class="avatar"
    :address="address"
    :profile-image="profileImage"
  />
</template>

<script>
import Backend from '../utils/backend';
import Avatar from './Avatar.vue';

export default {
  components: {
    Avatar,
  },
  props: {
    address: {
      type: [String, Object],
      default: null,
    },
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  computed: {
    profileImage() {
      const userImage = Backend.getProfileImageUrl(this.address);
      this.forceRerender();
      return this.address ? userImage : null;
    },
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>
