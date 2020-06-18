<template>
  <Page class="league-page-container">
    <div
      ref="jitsi"
      class="jitsi-container"
    />
  </Page>
</template>
<script>
import JitsiMeetExternalAPI from 'jitsi-iframe-api';
import Page from '../components/layout/Page.vue';
import { IS_MOBILE_DEVICE } from '../utils/util';

export default {
  name: 'Conference',
  components: {
    Page,
  },
  props: {
    room: { type: String, required: true },
  },
  mounted() {
    // eslint-disable-next-line no-new
    new JitsiMeetExternalAPI('test.league.aeternity.org', {
      parentNode: this.$refs.jitsi,
      width: '100%',
      height: '100%',
      roomName: this.room,
      configOverwrite: {
        disableDeepLinking: IS_MOBILE_DEVICE,
      },
    });
  },
};
</script>
<style lang="scss" scoped>
.league-page-container {
  padding-top: 1rem;
}
.jitsi-container,
.league-page-container {
  height: calc(100vh - 2em);
}
</style>
