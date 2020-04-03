<template>
  <div id="app">
    <div
      ref="wrapper"
      class="min-h-screen wrapper"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import aeternity from './utils/aeternity';
import { wallet } from './utils/walletSearch';
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import Util from './utils/util';

export default {
  name: 'App',
  data() {
    return {
      page: 1,
    };
  },
  computed: {
    ...mapGetters(['settings', 'tipSortBy']),
  },
  async created() {
    await this.initialLoad(true);
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    ...mapActions([
      'setLoggedInAccount', 'updateTopics', 'updateStats', 'updateCurrencyRates',
      'setOracleState', 'addLoading', 'removeLoading', 'setChainNames',
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
  },
  async created() {
    EventBus.$on('backendError', () => {
      this.$router.push({
        name: 'maintenance',
      });
    });
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    await this.reloadData(true);
    setInterval(() => this.reloadData(), 120 * 1000);
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
</style>
