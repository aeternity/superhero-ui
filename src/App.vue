<template>
  <div id="app">
    <div class="min-h-screen wrapper" ref="wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import aeternity from './utils/aeternity';
import { wallet } from './utils/walletSearch';
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import util from './utils/util';
import TipTopicUtil from './utils/tipTopicUtil';

export default {
  name: 'app',
  computed: {
    ...mapGetters(['settings', 'tipSortBy']),
  },
  methods: {
    ...mapActions([
      'setLoggedInAccount', 'setTipsOrdering', 'updateTips',
      'updateTopics', 'updateStats', 'updateCurrencyRates', 'setTipSortBy',
      'setOracleState', 'addLoading', 'removeLoading', 'setChainNames',
    ]),
    initWallet() {
      return Promise.race([
        new Promise((resolve) => wallet.init(async () => {
          const currentAccount = wallet.client.rpcClient.getCurrentAccount();
          const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
          this.setLoggedInAccount({
            account: currentAccount,
            balance: util.atomsToAe(balance).toFixed(2),
          });
          console.log('found wallet');
          resolve();
        })),
        new Promise((resolve) => setTimeout(resolve, 3000, 'TIMEOUT')),
      ]).then(() => {
        this.removeLoading('wallet');
      }).catch(console.error);
    },
    async reloadAsyncData(initial, stats) {
      // stats
      Promise.all([new Backend().getStats(), aeternity.client.height()])
        .then(([backendStats, height]) => {
          const newStats = { ...stats, ...backendStats, height };
          this.updateStats(newStats);
        }).catch((e) => {
          this.updateStats(stats);
          console.error(e);
        });
    },
    async reloadData(initial = false) {
      this.addLoading('tips');
      if (initial) {
        this.addLoading('initial');
        this.addLoading('wallet');
        await aeternity.initClient();
        this.initWallet();
      }

      // await fetch
      const backend = new Backend();
      const [
        stats, tips, chainNames, rates, oracleState
      ] = await Promise.all([
        backend.getCacheStats(),
        backend.getCacheTips(initial ? 'hot' : this.tipSortBy),
        backend.getCacheChainNames(),
        backend.getPrice(),
        backend.getOracleCache()
      ]);

      const topics = TipTopicUtil.getTipTopics(tips);

      // async fetch
      this.reloadAsyncData(initial, stats);
      this.updateTips(tips);
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.updateCurrencyRates(rates);
      this.setOracleState(oracleState);

      this.removeLoading('tips');
      this.removeLoading('initial');
    },
  },
  async created() {
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    EventBus.$on('setTipSortBy', () => {
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
