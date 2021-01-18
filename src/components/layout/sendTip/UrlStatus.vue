<template>
  <img
    class="url-status"
    v-bind="imgAttrs"
  >
</template>

<script>
import { mapState } from 'vuex';
import { urlStatus } from '../../../utils';
import verifiedUrl from '../../../assets/verifiedUrl.svg';
import notVerifiedUrl from '../../../assets/notVerifiedUrl.svg';
import blacklistedUrl from '../../../assets/blacklistedUrl.svg';
import notSecureUrl from '../../../assets/notSecureUrl.svg';
import defaultUrl from '../../../assets/defaultUrl.svg';

export default {
  props: {
    url: { type: String, default: '' },
  },
  computed: mapState({
    imgAttrs({ verifiedUrls, graylistedUrls }) {
      const status = urlStatus(this.url, verifiedUrls, graylistedUrls);
      this.$emit('is-blacklisted-url', status === 'blacklisted');

      switch (status) {
        case 'verified':
          return { src: verifiedUrl, title: this.$t('components.UrlStatus.verifiedTitle') };
        case 'not-verified':
          return { src: notVerifiedUrl, title: this.$t('components.UrlStatus.notverifiedTitle') };
        case 'blacklisted':
          return { src: blacklistedUrl, title: this.$t('components.UrlStatus.blacklisted') };
        case 'not-secure':
          return { src: notSecureUrl, title: this.$t('components.UrlStatus.notSecure') };
        default:
          return { src: defaultUrl };
      }
    },
  }),
};
</script>
