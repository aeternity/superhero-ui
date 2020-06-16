<template>
  <Page class="league-page-container">
    <div
      class="conference-page"
    >
      <div
        id="jitsi"
      />
    </div>
  </Page>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import JitsiMeetExternalAPI from 'jitsi-iframe-api';
import Page from '../components/layout/Page.vue';
import { IS_MOBILE_DEVICE } from '../utils/util';

export default {
  name: 'Conference',
  components: {
    Page,
  },
  mounted() {
    // eslint-disable-next-line no-new
    new JitsiMeetExternalAPI('localhost:8081', {
      parentNode: document.querySelector('#jitsi'),
      width: '100%',
      height: 440,
      roomName: this.$route.params.room,
      configOverwrite: {
        disableDeepLinking: IS_MOBILE_DEVICE,
      },
    });
  },
};
</script>
<style lang="scss">
.league-page-container {
  padding-top: 1rem;
}

.league-page {
  bottom: 0;
  position: absolute;
  top: 0;
  width: 31rem;
}

.league-page iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

@media (max-width: 1024px) {
  .league-page {
    max-width: 100vw;
    top: 3.4rem;
    width: 25rem;
  }
}
</style>
