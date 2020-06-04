<template>
  <Page class="league-page-container">
    <button
      v-if="!token"
      :disabled="!sdk"
      @click="joinMeeting"
    >
      {{ toTranslateLater }}
    </button>
    <div
      v-if="token"
      class="league-page"
    >
      <iframe :src="'https://test.league.aeternity.org/broadcast?jwt=' + token" />
    </div>
  </Page>
</template>
<script>
import { RpcAepp, Node } from '@aeternity/aepp-sdk/es';
import Detector from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/wallet-detector';
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import Page from '../components/layout/Page.vue';

const nodeUrl = 'https://mainnet.aeternity.io';

export default {
  name: 'League',
  components: {
    Page,
  },
  data: () => ({
    sdk: null,
    token: null,
    toTranslateLater: 'Join meeting with aeternity account',
  }),

  async created() {
    const sdk = await RpcAepp({
      name: 'JWT token generator',
      compilerUrl: 'https://compiler.aepps.com',
      nodes: [{
        name: 'why should I have node defined if I\'m not using it?',
        instance: await Node({ url: nodeUrl, internalUrl: nodeUrl }),
      }],
    });
    const scannerConnection = await BrowserWindowMessageConnection({
      connectionInfo: { id: 'spy' },
    });
    const detector = await Detector({ connection: scannerConnection });
    await new Promise((resolve) => {
      detector.scan(async ({ wallets, newWallet }) => {
        const wallet = newWallet || Object.values(wallets)[0];
        console.log(`Connecting to wallet ${wallet.name}`);
        detector.stopScan();
        await sdk.connectToWallet(await wallet.getConnection());
        resolve();
      });
    });
    await sdk.subscribeAddress('subscribe', 'current');
    this.sdk = sdk;
    // window.sdk = sdk;
  },
  methods: {
    async joinMeeting() {
      const message = `I would like to generate JWT token at ${new Date().toUTCString()}`;
      const signature = await this.sdk.signMessage(message);
      const address = await this.sdk.address();
      const token = await (await fetch('/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, message, signature }),
      })).text();
      this.token = token;
    },
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
