<template>
  <div id="app" class="min-h-screen">
    <div class="content min-h-screen max-w-desktop">
      <div class="min-h-screen wrapper" ref="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

  import aeternity from './utils/aeternity.js'
  import { mapGetters } from 'vuex';
  import { clearInterval, setInterval } from 'timers';
  import { wallet } from './utils/walletSearch';

  export default {
    name: 'app',
    data() {
      return {
        foundWallet: false
      }
    },
    computed: {
      ...mapGetters(['account', 'current', 'mainLoading', 'sdk', 'isLoggedIn']),
    },
    methods: {
      async checkAndReloadProvider() {
        if (!aeternity.address) return;
        const changesDetected = await aeternity.verifyAddress();
        // Reload the page, if changes have been detected.
        if (changesDetected) this.$router.go();
      },
      async initialize() {
        console.log('Initializing wallett')
        try {
          // Bypass check if there is already an active wallet
          if (aeternity.hasActiveWallet()) {
            this.$store.commit('SWITCH_LOGGED_IN', true);
            this.$store.commit('UPDATE_ACCOUNT', wallet.client.rpcClient.getCurrentAccount())
            return this.foundWallet = true;
          }
          // Otherwise init the aeternity sdk
          if (!(await aeternity.initClient()))
            return console.error('Wallet init failed');

          this.foundWallet = true;
          this.$store.commit('SWITCH_LOGGED_IN', true);
          this.$store.commit('UPDATE_ACCOUNT', wallet.client.rpcClient.getCurrentAccount())

          // Constantly check if wallet is changed
          setInterval(this.checkAndReloadProvider, 1000)
        } catch (e) {
          console.error('Initializing Wallet Error', e);
        }
      }
    },
    async created() {
      this.initialize();
    }
  }
</script>

<style >

  html{
    font-size: 125%;
  }

  .min-h-screen {
    min-width: 100%;
    padding-bottom: 0;
  }

  #app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
  }

</style>
