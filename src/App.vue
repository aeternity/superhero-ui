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
  import { setInterval } from 'timers';
  import BigNumber from 'bignumber.js';
  import { wallet } from './utils/walletSearch';
  import Backend from "./utils/backend";
  import Currency from "./utils/currency";
  import { EventBus } from "./utils/eventBus";
  import util from './utils/util';

  export default {
    name: 'app',
    data() {
      return {
        tempTips: [],
        showLoading: true,
        foundWallet: false
      }
    },
    computed: {
      ...mapGetters(['current', 'tipSortBy']),
    },
    methods: {
      async reloadData(initial = false) {
        this.showLoading = true;
        const fetchTips = async () => {
          if (initial) {
            await aeternity.initClient();

            wallet.init(async () => {
              this.foundWallet = true;
              let currentAccount = wallet.client.rpcClient.getCurrentAccount();
              const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
              this.$store.dispatch('setLoggedInAccount', {
                account: currentAccount,
                balance: util.atomsToAe(balance).toFixed(2)
              });

              console.log("found wallet")
            }).catch(console.error);
          }
          return aeternity.getTips().catch(console.error);
        };

        const backendInstance = new Backend();
        const fetchOrdering = backendInstance.tipOrder().catch(console.error);
        const fetchTipsPreview = backendInstance.tipPreview().catch(console.error);
        const fetchLangTips = backendInstance.getLangTips(this.activeLang).catch(console.error);
        const fetchRates = new Currency().getRates();
        let [{stats, topics, _, tips}, tipOrdering, tipsPreview, langTips, rates] =
          await Promise.all([fetchTips(), fetchOrdering, fetchTipsPreview, fetchLangTips, fetchRates]);

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

        // filter tips by language from backend
        if (langTips) tips = tips.filter(tip => langTips.some(url => tip.url === url));

        // add preview to tips from backend
        if (tipsPreview) {
          tips = tips.map(tip => {
            tip.preview = tipsPreview.find(preview => preview.requestUrl === tip.url);
            return tip;
          });
        }

        // add currency to tips
        if (rates) {
          tips = tips.map(tip => {
            tip.fiatValue = (tip.total_amount * rates.aeternity[this.current.currency]).toFixed(2);
            return tip;
          })//.filter(tip => tip.total_amount * (rates.aeternity['usd']).toFixed(2) > 0.01);
        }

        stats.height = await aeternity.client.height();

        this.$store.dispatch('setTipsOrdering', tipOrdering);
        this.$store.dispatch('updateTips', tips);
        this.$store.dispatch('updateTopics', Object.entries(topics).sort((a, b) => new BigNumber(b[1]).minus(a[1]).toNumber()));
        this.$store.dispatch('updateStats', stats);
        this.$store.dispatch('updateCurrencyRates', rates);

        this.$store.dispatch('setTipSortBy', initial ? tipOrdering ? "hot" : "highest" : this.tipSortBy);
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
