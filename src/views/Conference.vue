<template>
  <Page class="league-page-container">
    <div
      class="league-page"
    >
      <template v-if="counter > 0">
        {{ counter }}
        <div style="width: 100px;">
        </div>
      </template>
      <template v-else>
        <div
          id="jitsi"
        />
      </template>
    </div>
  </Page>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import JitsiMeetExternalAPI from 'jitsi';
import { mapState, mapGetters } from 'vuex';
import Page from '../components/layout/Page.vue';
import { IS_MOBILE_DEVICE, createDeepLinkUrl } from '../utils/util';

import { client } from '../utils/aeternity';

const TIMEOUT = 400000;

export default {
  name: 'Conference',
  components: {
    Page,
  },
  data() {
    return {
      counter: TIMEOUT / 1000,
      some: '',
    };
  },
  computed: {
    ...mapState(['useSdkWallet', 'account']),
    ...mapGetters(['isLoggedIn']),
  },
  created() {
    if (this.$route.query.fromWallet) {
      this.counter = 0;
    } else {
      this.runCounter();
    }

    if (!this.isLoggedIn) {
      const currentUrl = new URL(window.location);
      currentUrl.search = '';
      const successUrl = encodeURIComponent(`${currentUrl}?result=success&signature={signature}&fromWallet=true`);
      const signLink = createDeepLinkUrl({
        type: 'sign-message',
        message: `I would like to generate JWT token at ${new Date().toUTCString()}`,
        'x-success': successUrl,
      }).href;

      window.location = createDeepLinkUrl({
        type: 'address',
        'x-success': `${signLink}?address={address}`,
      });
    }

    setTimeout(async () => {
      const message = `I would like to generate JWT token at ${new Date().toUTCString()}`;
      let signature;
      let address;
      if (this.useSdkWallet) {
        signature = await client.signMessage(message);
        address = client.rpcClient.getCurrentAccount();

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
          configOverwrite: {
            disableDeepLinking: IS_MOBILE_DEVICE,
          },
        });
      } else {
        const currentUrl = new URL(window.location);
        currentUrl.search = '';
        const successUrl = encodeURIComponent(`${currentUrl}?result=success&signature={signature}&fromWallet=true`);
        // window.location = createDeepLinkUrl({
        window.location = createDeepLinkUrl({
          type: 'sign-message',
          message,
          'x-success': successUrl,
        });
      }
    }, TIMEOUT);
  },
  methods: {
    sdkLogin() {

    },
    deepLinkLogin() {

    },
    runCounter() {
      setInterval(() => {
        this.counter -= 1;
      }, 1000);
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
