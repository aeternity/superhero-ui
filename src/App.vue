<template>
  <div
    id="app"
    @mousedown="saveScrollPosition"
  >
    <div
      ref="wrapper"
      class="min-h-screen wrapper"
    >
      <div
        v-if="isSupportedBrowser"
        class="supportedbrowser--alert"
      >
        {{ $t('noExtensionSupport') }}
      </div>
      <keep-alive :max="5">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { detect } from 'detect-browser';
import { client, initClient, scanForWallets } from './utils/aeternity';
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import Util, { IS_MOBILE_DEVICE, supportedBrowsers } from './utils/util';

export default {
  name: 'App',
  data() {
    return {
      urlAddress: this.$route.query.address,
      savedScrolls: [],
    };
  },
  computed: {
    ...mapState(['account']),
    isSupportedBrowser() {
      const browser = detect();
      return !IS_MOBILE_DEVICE && (browser && !supportedBrowsers.includes(browser.name));
    },
  },
  async created() {
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
    EventBus.$on('backendError', () => {
      this.$router.push({
        name: 'maintenance',
      }).catch((err) => { console.error(err); });
    });
    await this.initialLoad();
    this.$router.afterEach((to) => {
      setTimeout(
        () => {
          document.scrollingElement.scrollTop = this.savedScrolls[to.fullPath] || 0;
        },
        100,
      );
    });
  },
  methods: {
    ...mapMutations([
      'setLoggedInAccount', 'updateTopics', 'updateStats', 'updateCurrencyRates',
      'setOracleState', 'addLoading', 'removeLoading', 'setChainNames', 'updateBalance',
      'setGraylistedUrls', 'setVerifiedUrls', 'useSdkWallet',
    ]),
    async reloadAsyncData(stats) {
      // stats
      Promise.all([Backend.getStats(), client.height()])
        .then(([backendStats, height]) => {
          const newStats = { ...stats, ...backendStats, height };
          this.updateStats(newStats);
        }).catch((e) => {
          this.updateStats(stats);
          console.error(e);
        });
    },
    async reloadData() {
      // await fetch
      const [
        stats, chainNames, rates, oracleState, topics, verifiedUrls, graylistedUrls,
      ] = await Promise.all([
        Backend.getCacheStats(),
        Backend.getCacheChainNames(),
        Backend.getPrice(),
        Backend.getOracleCache(),
        Backend.getTopicsCache(),
        Backend.getVerifiedUrls(),
        Backend.getGrayListedUrls(),
      ]);

      if (this.account) {
        const balance = await client.balance(this.account).catch(() => 0);
        this.updateBalance(Util.atomsToAe(balance).toFixed(2));
      }

      // async fetch
      this.reloadAsyncData(stats);
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.updateCurrencyRates(rates);
      this.setOracleState(oracleState);
      this.setGraylistedUrls(graylistedUrls);
      this.setVerifiedUrls(verifiedUrls);
    },
    async initialLoad() {
      this.addLoading('initial');
      this.addLoading('wallet');
      await initClient();
      await this.reloadData();
      this.removeLoading('initial');
      if (this.account) this.removeLoading('wallet');

      let address = this.urlAddress;
      if (!address) {
        await scanForWallets();
        address = client.rpcClient.getCurrentAccount();
        console.log('found wallet');
        this.useSdkWallet();
      }
      const balance = await client.balance(address).catch(() => 0);
      Backend.getProfile(this.address)
        .then((userProfile) => {
          if (userProfile) this.$store.commit('setUserProfile', userProfile);
        })
        .catch(console.error);
      this.setLoggedInAccount({
        account: address,
        balance: Util.atomsToAe(balance).toFixed(2),
      });
      this.removeLoading('wallet');
    },
    saveScrollPosition() {
      this.savedScrolls[this.$route.fullPath] = document.scrollingElement.scrollTop;
    },
  },
};
</script>

<style lang="scss">
  @import "styles/layout";

  .min-h-screen {
    min-height: 100vh;
    min-width: 100%;
    padding-bottom: 0;
  }

  #app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
  }

  .supportedbrowser--alert {
    text-align: center;
    line-height: 3rem;
  }
</style>
