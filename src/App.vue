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
  import { mapActions, mapGetters } from 'vuex';
  import { setInterval } from 'timers';
  import { wallet } from './utils/walletSearch';
  import Backend from "./utils/backend";
  import Currency from "./utils/currency";
  import { EventBus } from "./utils/eventBus";
  import util from './utils/util';
  import TipTopicUtil from './utils/tipTopicUtil';

  export default {
    name: 'app',
    data() {
      return {
        tempTips: [],
        showLoading: true
      }
    },
    computed: {
      ...mapGetters(['settings', 'tipSortBy']),
    },
    methods: {
      ...mapActions(['setLoggedInAccount', 'setTipsOrdering', 'updateTips', 'updateTopics', 'updateStats', 'updateCurrencyRates', 'setTipSortBy', 'setOracleState']),
      reloadAsyncData(initial, stats) {
        // wallet

        if (initial) wallet.init(async () => {
          let currentAccount = wallet.client.rpcClient.getCurrentAccount();
          const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
          this.setLoggedInAccount({
            account: currentAccount,
            balance: util.atomsToAe(balance).toFixed(2)
          });

          console.log("found wallet")
        }).catch(console.error);

        // stats
        Promise.all([new Backend().getStats(), aeternity.client.height()]).then(([backendStats, height]) => {
          stats = {...stats, ...backendStats, ...{height: height}};
          this.updateStats(stats);
        }).catch(e => {
          this.updateStats(stats);
          console.error(e);
        });

        // currency rates
        new Currency().getRates().then(rates => {
          this.updateCurrencyRates(rates);
        }).catch(console.error);

        // oracle state
        aeternity.oracleContract.methods.get_state().then(state => {
          this.setOracleState(state.decodedResult);
        }).catch(console.error);
      },
      async reloadData(initial = false) {
        this.showLoading = true;

        const fetchTips = async () => {
          if (initial) await aeternity.initClient();
          return aeternity.getTips().catch(console.error);
        };

        // await fetch
        const backendInstance = new Backend();
        const fetchOrdering = backendInstance.tipOrder().catch(console.error);
        const fetchTipsPreview = backendInstance.tipPreview().catch(console.error);
        const fetchLangTips = backendInstance.getLangTips(this.activeLang).catch(console.error);
        let [{stats, _, tips}, tipOrdering, tipsPreview, langTips] =
          await Promise.all([fetchTips(), fetchOrdering, fetchTipsPreview, fetchLangTips]);

        // async fetch
        this.reloadAsyncData(initial, stats);

        // add score from backend to tips
        if (tipOrdering) {
          const blacklistedTipIds = tipOrdering.map(order => order.id);
          const filteredTips = tips.filter(tip => blacklistedTipIds.includes(tip.id));
          tips = filteredTips.map(tip => {
            const orderItem = tipOrdering.find(order => order.id === tip.id);
            tip.score = orderItem ? orderItem.score : 0;
            return tip;
          });
        }

        const topics = TipTopicUtil.getTipTopics(tips);

        // filter tips by language from backend
        if (langTips) tips = tips.filter(tip => langTips.some(url => tip.url === url));

        // add preview to tips from backend
        if (tipsPreview) {
          tips = tips.map(tip => {
            tip.preview = tipsPreview.find(preview => preview.requestUrl === tip.url);
            return tip;
          });
        }

        this.setTipsOrdering(tipOrdering);
        this.updateTips(tips);
        this.updateTopics(topics);
        this.setTipSortBy(initial ? tipOrdering ? "hot" : "highest" : this.tipSortBy);

        this.showLoading = false;
      }
    },
    async created() {
      EventBus.$on("reloadData", () => {
        this.reloadData();
      });

      await this.reloadData(true);
      setInterval(() => this.reloadData(), 120 * 1000);
    }
  }
</script>

<style>

  html {
    font-size: 135%;
  }

  .min-h-screen {
    min-width: 100%;
    padding-bottom: 0;
  }

  #app {
    font-family: Roboto, Helvetica, Arial, sans-serif;
  }

</style>
