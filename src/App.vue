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
  import {EventBus} from "./utils/eventBus";
  import util from './utils/util';

  export default {
    name: 'app',
    data() {
      return {
        tempTips: [],
        tipsOrdering: null,
        showLoading: true,
        foundWallet: false
      }
    },
    computed: {
      ...mapGetters(['tips', 'tipSortBy', 'current', 'account', 'isLoggedIn']),
    },
    methods: {
      async asyncAddCurrency() {
        new Currency().getRates().then(rates => {
          console.log(rates);
          this.$store.commit('CURRENCY_RATES', rates)
          this.tempTips = this.tempTips.map(tip => {
            tip.fiatValue = (tip.total_amount * rates.aeternity[this.current.currency]).toFixed(2);
            return tip;
          }).filter(tip => tip.amount * (rates.aeternity['usd']).toFixed(2) > 0.01);
          this.$store.commit('UPDATE_TIPS', this.tempTips)
        }).catch(console.error);
      },
      async reloadData(initial = false) {
        this.showLoading = true;
        const fetchTips = async () => {
          if (initial) {
            await aeternity.initClient();

            wallet.init(async () => {
              this.foundWallet = true;
              let currentAccount = wallet.client.rpcClient.getCurrentAccount()
              this.$store.commit('SWITCH_LOGGED_IN', true);
              this.$store.commit('UPDATE_ACCOUNT', currentAccount)

              const balance = await aeternity.client.balance(currentAccount).catch(() => 0);
              this.$store.commit('UPDATE_BALANCE', util.atomsToAe(balance).toFixed(5));

              console.log("found wallet")
            }).catch(console.error);
          }
          return aeternity.getTips().catch(console.error);
        };

        const backendInstance = new Backend();
        const fetchOrdering = backendInstance.tipOrder().catch(console.error);
        const fetchTipsPreview = backendInstance.tipPreview().catch(console.error);
        const fetchLangTips = backendInstance.getLangTips(this.activeLang).catch(console.error);
        let [{stats, topics, _, tips}, tipOrdering, tipsPreview, langTips] = await Promise.all([fetchTips(), fetchOrdering, fetchTipsPreview, fetchLangTips]);
        this.tipsOrdering = tipOrdering;
        this.tipsPreview = tipsPreview;

        // add score from backend to tips
        if (this.tipsOrdering) {
          const blacklistedTipIds = tipOrdering.map(order => order.id);
          const filteredTips = tips.filter(tip => blacklistedTipIds.includes(tip.id));
          tips = filteredTips.map(tip => {
            const orderItem = tipOrdering.find(order => order.id === tip.id);
            tip.score = orderItem ? orderItem.score : 0;
            return tip;
          });
        }

        this.$store.dispatch('setTipsOrdering', this.tipsOrdering);

        // filter tips by language from backend
        // if (langTips) tips = tips.filter(tip => langTips.some(url => tip.url === url));

        // add preview to tips from backend
        if (this.tipsPreview) {
          tips = tips.map(tip => {
            tip.preview = tipsPreview.find(preview => preview.requestUrl === tip.url);
            return tip;
          });
        }

        this.tempTips = tips;
        this.$store.commit('UPDATE_TIPS', this.tempTips);
        this.$store.commit('UPDATE_TOPICS', Object.entries(topics).sort((a, b) => new BigNumber(b[1]).minus(a[1]).toNumber()));

        stats.height = await aeternity.client.height();
        this.$store.commit('UPDATE_STATS', stats);

        this.asyncAddCurrency();

        if (initial) this.$store.dispatch('setTipSortBy', this.tipsOrdering ? "hot" : "latest");
        this.showLoading = false;
      },
      async checkAndReloadProvider() {
        if (!aeternity.address) return;
        const changesDetected = await aeternity.verifyAddress();
        // Reload the page, if changes have been detected.
        if (changesDetected) this.$router.go();
      },
      async initialize() {
        console.log('Initializing wallet')
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

          // Constantly check if wallet is changed
          setInterval(this.checkAndReloadProvider, 1000)
        } catch (e) {
          console.error('Initializing Wallet Error', e);
        }
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
