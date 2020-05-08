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
import { mapActions, mapGetters } from 'vuex';
import { detect } from 'detect-browser';
import aeternity from './utils/aeternity';
import { wallet } from './utils/walletSearch';
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import Util, { IS_MOBILE_DEVICE, supportedBrowsers } from './utils/util';

export default {
  name: 'App',
  data() {
    return {
      savedScrolls: [],
    };
  },
  computed: {
    ...mapGetters(['account']),
    isSupportedBrowser() {
      const browser = detect();
      return !IS_MOBILE_DEVICE && (browser && !supportedBrowsers.includes(browser.name));
    },
  },
  async created() {
    await this.initialLoad(true);
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
    EventBus.$on('backendError', () => {
      this.$router.push({
        name: 'maintenance',
      });
    });
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
    ...mapActions([
      'setLoggedInAccount', 'updateTopics', 'updateStats', 'updateCurrencyRates',
      'setOracleState', 'addLoading', 'removeLoading', 'setChainNames', 'updateBalance',
    ]),
    initWallet() {
      return Promise.race([
        new Promise((resolve) => wallet.init(async () => {
          const currentAccount = wallet.client.rpcClient.getCurrentAccount();
          const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
          this.setLoggedInAccount({
            account: currentAccount,
            balance: Util.atomsToAe(balance).toFixed(2),
          });
          console.log('found wallet');
          resolve();
        })),
        new Promise((resolve) => setTimeout(resolve, 3000, 'TIMEOUT')),
      ]).then(() => {
        this.removeLoading('wallet');
      }).catch(console.error);
    },
    async reloadAsyncData(stats) {
      // stats
      Promise.all([Backend.getStats(), aeternity.client.height()])
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
        stats, chainNames, rates, oracleState, topics,
      ] = await Promise.all([
        Backend.getCacheStats(),
        Backend.getCacheChainNames(),
        Backend.getPrice(),
        Backend.getOracleCache(),
        Backend.getTopicsCache(),
      ]);

      if (this.account) {
        const balance = await aeternity.client.balance(this.account).catch(() => 0);
        this.updateBalance(Util.atomsToAe(balance).toFixed(2));
      }

      // async fetch
      this.reloadAsyncData(stats);
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.updateCurrencyRates(rates);
      this.setOracleState(oracleState);
    },
    async initialLoad() {
      this.addLoading('initial');
      this.addLoading('wallet');
      await aeternity.initClient();
      this.initWallet();

      await this.reloadData();

      this.removeLoading('initial');
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
