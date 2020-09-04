<template>
  <div id="app">
    <div
      v-if="isSupportedBrowser"
      class="supportedbrowser--alert"
    >
      {{ $t('noExtensionSupport') }}
    </div>
    <MobileNavigation v-if="!$route.meta.fullScreen" />
    <div class="not-bootstrap-row">
      <div
        v-if="!$route.meta.fullScreen"
        class="sidebar-sticky"
      >
        <LeftSection />
      </div>
      <RouterView class="router-view" />
      <div
        v-if="!$route.meta.fullScreen"
        class="sidebar-sticky"
      >
        <RightSection />
      </div>
    </div>
    <Component
      :is="component"
      v-for="{ component, key, props } in opened"
      :key="key"
      v-bind="props"
    />
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import { detect } from 'detect-browser';
import { client, initClient, scanForWallets } from './utils/aeternity';
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import Util, { IS_MOBILE_DEVICE, supportedBrowsers } from './utils/util';
import MobileNavigation from './components/layout/MobileNavigation.vue';
import LeftSection from './components/layout/LeftSection.vue';
import RightSection from './components/layout/RightSection.vue';

export default {
  name: 'App',
  components: { MobileNavigation, LeftSection, RightSection },
  computed: {
    ...mapGetters('modals', ['opened']),
    ...mapState(['address']),
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
    EventBus.$on('backendError', () => this.$route.name !== 'maintenance' && this.$router.push({
      name: 'maintenance',
    }).catch((err) => { console.error(err); }));
    await this.initialLoad();
  },
  methods: {
    ...mapMutations([
      'setLoggedInAccount', 'updateTopics', 'updateCurrencyRates',
      'setOracleState', 'addLoading', 'removeLoading', 'setChainNames', 'updateBalance',
      'setGraylistedUrls', 'setVerifiedUrls', 'useSdkWallet', 'setPinnedItems',
    ]),
    async reloadData() {
      // await fetch
      const [
        chainNames, oracleState, topics, verifiedUrls, graylistedUrls,
      ] = await Promise.all([
        Backend.getCacheChainNames(),
        Backend.getOracleCache(),
        Backend.getTopicsCache(),
        Backend.getVerifiedUrls(),
        Backend.getGrayListedUrls(),
        this.$store.dispatch('backend/reloadStats'),
        this.$store.dispatch('backend/reloadPrices'),
      ]);

      if (this.address) {
        const balance = await client.balance(this.address).catch(() => 0);
        this.updateBalance(Util.atomsToAe(balance).toFixed(2));
      }

      // async fetch
      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.setOracleState(oracleState);
      this.setGraylistedUrls(graylistedUrls);
      this.setVerifiedUrls(verifiedUrls);
    },
    async fetchUserData() {
      await Promise.all([
        this.$store.dispatch('updatePinnedItems'),
        this.$store.dispatch('updateUserProfile'),
      ]);
    },
    async initialLoad() {
      this.addLoading('initial');
      this.addLoading('wallet');
      await initClient();
      await this.reloadData();
      this.removeLoading('initial');
      if (this.address) {
        this.removeLoading('wallet');
        this.fetchUserData();
      }

      let { address } = this.$route.query;
      if (!address) {
        await scanForWallets();
        address = client.rpcClient.getCurrentAccount();
        console.log('found wallet');
        this.useSdkWallet();
      }
      const balance = await client.balance(address).catch(() => 0);
      this.setLoggedInAccount({
        address,
        balance: Util.atomsToAe(balance).toFixed(2),
      });
      this.fetchUserData();
      this.removeLoading('wallet');
    },
  },
};
</script>

<style lang="scss">
:root {
  --container-width: 59rem;
}

@include mobile {
  :root {
    --container-width: 25rem;
  }
}

@media (min-width: 1200px) {
  html {
    font-size: 125%;
  }
}

@media (min-width: 1440px) {
  :root {
    --container-width: 61rem;
  }
}
</style>

<style lang="scss" scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 0 auto;
  min-height: 100vh;
  max-width: var(--container-width);
  display: flex;
  flex-direction: column;

  .supportedbrowser--alert {
    text-align: center;
    line-height: 3rem;
  }

  .not-bootstrap-row {
    flex-grow: 1;
    display: flex;
    flex-wrap: nowrap;

    .sidebar-sticky {
      flex-shrink: 0;

      > div {
        position: sticky;
        top: 0;
      }

      @include mobile {
        display: none;
      }

      .left-section,
      .right-section {
        padding-top: 1rem;
      }

      .left-section {
        width: 9.2rem;
        margin-right: 15px;

        @media (min-width: 1440px) {
          margin-right: calc(15px + 1rem); // TODO: Replace with a rem value
        }
      }

      .right-section {
        width: 17.5rem;
        margin-left: calc(15px + 0.8rem); // TODO: Replace with a rem value
      }
    }

    .router-view {
      flex-grow: 1;
      min-width: 0; // https://css-tricks.com/flexbox-truncated-text/
    }
  }
}
</style>
