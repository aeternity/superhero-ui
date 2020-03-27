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
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    EventBus.$on('loadMoreTips', async () => {
      this.loadMoreTips();
    });
    EventBus.$on('setTipSortBy', () => {
      window.scrollTo(0,0);
      this.page = 1;
      this.reloadData();
    });

    await this.initialLoad(true);
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    ...mapActions([
      'setLoggedInAccount', 'setTipsOrdering', 'updateTips', 'addTips',
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
    async initialLoad() {
      this.addLoading('tips');
      this.addLoading('initial');
      this.addLoading('wallet');
      await aeternity.initClient();
      this.initWallet();

      // await fetch
      const [
        stats, tips, chainNames, rates, oracleState, topics,
      ] = await Promise.all([
        Backend.getCacheStats(),
        Backend.getCacheTips('hot', this.page),
        Backend.getCacheChainNames(),
        Backend.getPrice(),
        Backend.getOracleCache(),
        Backend.getTopicsCache(),
      ]);

      // async fetch
      this.reloadAsyncData(true, stats);
      this.updateTips(tips);
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.updateCurrencyRates(rates);
      this.setOracleState(oracleState);

      this.removeLoading('tips');
      this.removeLoading('initial');
    },
    async reloadData() {
      this.addLoading('tips');

      const tips = await Util.range(1, this.page)
        .asyncMap(async (page) => Backend.getCacheTips(this.tipSortBy, page));
      this.removeLoading('tips');
      this.updateTips(tips);
    },
    async loadMoreTips() {
      this.addLoading('moreTips');
      const tips = await Backend.getCacheTips(this.tipSortBy, this.page + 1);
      if (tips.length > 0) this.page += 1;
      this.removeLoading('moreTips');
      this.addTips(tips);
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
</style>
