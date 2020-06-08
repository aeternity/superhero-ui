<template>
  <span class="status">
    <img
      v-show="status === 'verified'"
      :title="$t('components.UrlStatus.verifiedTitle')"
      src="../../../assets/verifiedUrl.svg"
    >
    <img
      v-show="status === 'not-verified'"
      src="../../../assets/notVerifiedUrl.svg"
      :title="$t('components.UrlStatus.notverifiedTitle')"
    >
    <img
      v-show="status === 'blacklisted'"
      src="../../../assets/blacklistedUrl.svg"
      :title="$t('components.UrlStatus.blacklisted')"
    >
    <img
      v-show="status === ''"
      src="../../../assets/defaultUrl.svg"
    >
  </span>
</template>

<script>
import { mapState } from 'vuex';
import { urlStatus } from '../../../utils/util';
import { EventBus } from '../../../utils/eventBus';

export default {
  name: 'UrlStatus',
  props: {
    url: { type: String, default: '' },
  },
  computed: {
    ...mapState(['verifiedUrls', 'graylistedUrls']),
    status() {
      let retrievedStatus = '';
      if (this.url) {
        retrievedStatus = urlStatus(this.url, this.verifiedUrls, this.graylistedUrls);

        if (retrievedStatus === 'blacklisted') {
          EventBus.$emit('blacklistedUrl', true);
        } else {
          EventBus.$emit('blacklistedUrl', false);
        }
      }
      return retrievedStatus;
    },
  },
};
</script>

<style lang="scss" scoped>
  .status {
    width: 0.85rem;

    &:hover {
      cursor: pointer;
    }
  }
</style>
