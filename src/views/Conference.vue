<template>
  <Page class="league-page-container">
    <div
      ref="jitsi"
      class="jitsi-container"
    />
  </Page>
</template>
<script>
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import JitsiMeetExternalAPI from 'jitsi-iframe-api';
import Page from '../components/layout/Page.vue';
import { IS_MOBILE_DEVICE } from '../utils/util';

export default {
  name: 'Conference',
  components: {
    Page,
  },
  props: {
    room: { type: String, default: '' },
  },
  async mounted() {
    const connection = await BrowserWindowMessageConnection({
      origin: 'https://localhost:8080',
    });

    connection.connect(({ room }) => {
      this.$router.push({ name: 'conference', params: { room } });
    });

    // eslint-disable-next-line no-new
    new JitsiMeetExternalAPI('localhost:8080 ', {
      parentNode: this.$refs.jitsi,
      width: '100%',
      height: '100%',
      roomName: this.room || '',
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
