<template>
  <div>
    <BackButtonRibbon
      title="WordBazaar"
      hide-back
    />

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabs"
    />

    <template v-if="activity === 'assets'">
      <TabBar
        v-model="activeTab"
        :tabs="tabs"
      />

      <WordListing heading />

      <Loading
        v-if="wordRegistryState === null"
        above-content
      />

      <div v-else>
        <div
          v-for="[word, sale] in wordRegistryState && wordRegistryState.tokens"
          :key="word"
        >
          <WordListing
            :word="word"
            :sale="sale"
          />
        </div>
      </div>
    </template>

    <CreateToken
      v-if="activity === 'create'"
      :navigate-assets="() => activity = 'assets'"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loading from '../components/Loading.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import CreateToken from '../components/CreateToken.vue';
import IconHelp2 from '../assets/iconHelp2.svg?icon-component';
import IconTokens from '../assets/iconTokens.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import IconAe from '../assets/iconAe.svg?icon-component';
import { EventBus } from '../utils/eventBus';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
    Loading,
    BackButtonRibbon,
    ActivityRibbon,
    TabBar,
    CreateToken,
  },
  data: () => ({
    wordRegistryState: null,
    activity: 'assets',
    activeTab: 'all',
    ribbonTabs: [
      { icon: IconTokens, text: 'Assets', activity: 'assets' },
      { icon: IconPlus, text: 'Create token', activity: 'create' },
      { icon: IconAe, text: 'Get AE', activity: 'getae' },
      { icon: IconHelp2, text: 'How it works', activity: 'how' },
    ],
    tabs: [
      { text: 'All tokens', tab: 'all' },
      { text: 'Trending', tab: 'trending' },
      { text: 'Recent', tab: 'recent' },
    ],
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    this.reloadData();
  },
  created() {
    this.reloadData();
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async reloadData() {
      this.wordRegistryState = await Backend.getWordRegistry();
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  margin-right: 0.5rem;
  text-decoration: underline !important;
}

h2 {
  margin-top: 1rem;
}
</style>
