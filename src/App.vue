<template>
  <div id="app">
    <div class="min-h-screen wrapper" ref="wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import aeternity from './utils/aeternity.js';
import { wallet } from './utils/walletSearch';
import Backend from './utils/backend';
import Currency from './utils/currency';
import { EventBus } from './utils/eventBus';
import util from './utils/util';
import AggregateData from './utils/aggregateData';
import TipTopicUtil from './utils/tipTopicUtil';

export default {
  name: 'app',
  computed: {
    ...mapGetters(['settings', 'tipSortBy']),
  },
  methods: {
    ...mapActions(['setLoggedInAccount', 'setTipsOrdering', 'updateTips', 'updateTopics', 'updateStats', 'updateCurrencyRates', 'setTipSortBy', 'setOracleState', 'addLoading', 'removeLoading', 'setChainNames']),
    initWallet() {
      return Promise.race([
        new Promise((resolve, _) => wallet.init(async () => {
          const currentAccount = wallet.client.rpcClient.getCurrentAccount();
          const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
          this.setLoggedInAccount({
            account: currentAccount,
            balance: util.atomsToAe(balance).toFixed(2),
          });
          console.log('found wallet');
          resolve();
        })),
        new Promise((resolve, _) => setTimeout(resolve, 3000, 'TIMEOUT')),
      ]).then(() => {
        this.removeLoading('wallet');
      }).catch(console.error);
    },
    reloadAsyncData(initial, stats) {
      // stats
      Promise.all([new Backend().getStats(), aeternity.client.height()]).then(([backendStats, height]) => {
        stats = { ...stats, ...backendStats, ...{ height } };
        this.updateStats(stats);
      }).catch((e) => {
        this.updateStats(stats);
        console.error(e);
      });
      // currency rates
      new Currency().getRates().then((rates) => {
        this.updateCurrencyRates(rates);
      }).catch(console.error);
      // oracle state
      aeternity.oracleContract.methods.get_state().then((state) => {
        this.setOracleState(state.decodedResult);
      }).catch(console.error);
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
      const {
        stats, tips, hasOrdering, chainNames,
      } = await AggregateData.fetchTips();
      const topics = TipTopicUtil.getTipTopics(tips);
      // async fetch
      this.reloadAsyncData(initial, stats);
      this.updateTips(tips);
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.setTipsOrdering(hasOrdering);
      this.setTipSortBy(initial ? hasOrdering ? 'hot' : 'highest' : this.tipSortBy);
      this.removeLoading('tips');
      if (initial) this.removeLoading('initial');
    },
  },
  async created() {
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
