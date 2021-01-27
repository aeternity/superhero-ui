<template>
  <div id="app">
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
import Backend from './utils/backend';
import { EventBus } from './utils/eventBus';
import { atomsToAe } from './utils';
import MobileNavigation from './components/layout/MobileNavigation.vue';
import LeftSection from './components/layout/LeftSection.vue';
import RightSection from './components/layout/RightSection.vue';

export default {
  components: { MobileNavigation, LeftSection, RightSection },
  computed: {
    ...mapGetters('modals', ['opened']),
    ...mapState(['address']),
    ...mapState('aeternity', ['sdk']),
  },
  async created() {
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);

    await this.$store.dispatch('aeternity/initSdk');
    await Promise.all([
      this.initWallet(),
      this.reloadData(),
    ]);

    EventBus.$on('maintenance', () => this.$router.push({ name: 'maintenance' }));
  },
  methods: {
    ...mapMutations([
      'setAddress', 'updateTopics',
      'setOracleState', 'setChainNames', 'updateBalance',
      'setGraylistedUrls', 'setTokenInfo', 'setVerifiedUrls',
    ]),
    ...mapMutations('aeternity', ['useSdkWallet']),
    async reloadData() {
      const [
        chainNames, oracleState, topics, verifiedUrls, graylistedUrls, tokenInfo,
      ] = await Promise.all([
        Backend.getCacheChainNames(),
        Backend.getOracleCache(),
        Backend.getTopicsCache(),
        Backend.getVerifiedUrls(),
        Backend.getGrayListedUrls(),
        Backend.getTokenInfo(),
        this.$store.dispatch('backend/reloadStats'),
        this.$store.dispatch('backend/reloadPrices'),
        this.reloadUserData(),
      ]);

      this.updateTopics(topics);
      this.setChainNames(chainNames);
      this.setOracleState(oracleState);
      this.setGraylistedUrls(graylistedUrls);
      this.setVerifiedUrls(verifiedUrls);
      this.setTokenInfo(tokenInfo);
    },
    async reloadUserData() {
      if (!this.address) return;
      await Promise.all([
        this.$store.dispatch('updatePinnedItems'),
        this.$store.dispatch('updateUserProfile'),
        (async () => {
          const balance = await this.sdk.balance(this.address).catch(() => 0);
          this.updateBalance(atomsToAe(balance).toFixed(2));
        })(),
        this.$store.dispatch('updateTokensBalanceAndPrice'),
      ]);
    },
    async initWallet() {
      let { address } = this.$route.query;
      if (!address) {
        address = await this.$store.dispatch('aeternity/scanForWallets');
        console.log('found wallet');
        this.useSdkWallet();
        this.setAddress(address);
        this.$store.dispatch('updateCookiesConsent');
      } else {
        this.setAddress(address);
      }
      await this.reloadUserData();
    },
  },
  metaInfo: {
    titleTemplate: '%s - Superhero.com',
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
  margin: 0 auto;
  min-height: 100vh;
  max-width: var(--container-width);
  display: flex;
  flex-direction: column;

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
