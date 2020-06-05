<template>
  <Page class="league-page-container">
    <div
      class="league-page"
    >
      <div id="jitsi" />
    </div>
  </Page>
</template>
<script>
import Page from '../components/layout/Page.vue';
import { wallet } from '../utils/walletSearch';

export default {
  name: 'Conference',
  components: {
    Page,
  },
  async created() {
    const message = `I would like to generate JWT token at ${new Date().toUTCString()}`;
    const signature = await wallet.signMessage(message);
    const address = wallet.client.rpcClient.getCurrentAccount();

    const token = await (await fetch('https://jwt.z52da5wt.xyz/claim ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, message, signature }),
    })).text();

    // eslint-disable-next-line no-undef, no-new
    new JitsiMeetExternalAPI('test.league.aeternity.org', {
      parentNode: document.querySelector('#jitsi'),
      width: '100%',
      height: 440,
      roomName: this.$route.params.room,
      jwt: token,
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
