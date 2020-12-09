<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <BackButtonRibbon
      title="WordBazaar"
      hide-back
    />

    <ActivityRibbon
      v-model="activity"
      :tabs="ribbonTabs"
    />

    <TabBar
      v-model="activeTab"
      :tabs="tabs"
    />

    <div class="input-group mb-2 d-none">
      <input
        v-model="newWord"
        class="form-control"
      >
      <OutlinedButton
        class="green"
        @click="createWordSale"
      >
        <Loading
          v-if="loadingState && wordRegistryState !== null"
          small
          class="p-0"
        />
        <span v-else>+</span>
      </OutlinedButton>
      <Modal
        v-if="createProgressText"
        @close="createProgressText = null"
      >
        {{ createProgressText }}
      </Modal>
    </div>

    <WordListing heading />

    <Loading
      v-if="loadingState && wordRegistryState === null"
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
  </div>
</template>

<script>
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import BONDING_CURVE_MOCK from 'wordbazaar-contracts/BondingCurveMock.aes';
import { mapState } from 'vuex';
import { getClient } from '../utils/aeternity';
import Backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loading from '../components/Loading.vue';
import OutlinedButton from '../components/OutlinedButton.vue';
import { EventBus } from '../utils/eventBus';
import Modal from '../components/Modal.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
    Loading,
    OutlinedButton,
    Modal,
    BackButtonRibbon,
    ActivityRibbon,
    TabBar,
  },
  data: () => ({
    newWord: '',
    words: [],
    wordRegistryState: null,
    selectedWord: null,
    selectedWordContract: null,
    buyAmount: 0,
    sellAmount: 0,
    spread: 0,
    votes: null,
    newVotePayout: '',
    loadingState: true,
    createProgressText: null,
    activity: 'assets',
    activeTab: 'all',
    ribbonTabs: [{ icon: IconInfo, text: 'Assets', activity: 'assets' }, { icon: IconPie, text: 'Create word', activity: 'create' }, { icon: IconPie, text: 'How it works', activity: 'how' }],
    tabs: [{ text: 'All tokens', tab: 'all' }, { text: 'Trending', tab: 'trending' }, { text: 'Recent', tab: 'recent' }],
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    this.updateWords();
  },
  methods: {
    async updateWords() {
      this.loadingState = true;
      this.wordRegistryState = await Backend.getWordRegistry();
      this.loadingState = false;
      this.newWord = '';
    },
    async createWordSale() {
      this.loadingState = true;
      const bondingCurveMock = await getClient().then((client) => client
        .getContractInstance(BONDING_CURVE_MOCK));
      this.createProgressText = `Please confirm popup 1 of 5\n\n Creating Bonding Curve Contract for sale of ${this.newWord} Tokens`;
      await bondingCurveMock.deploy();
      const tokenSale = await getClient().then((client) => client
        .getContractInstance(TOKEN_SALE_CONTRACT));
      this.createProgressText = `Please confirm popup 2 of 5\n\n Creating Token Sale Contract for ${this.newWord} Tokens`;
      await tokenSale.methods.init(20, bondingCurveMock.deployInfo.address);
      const token = await getClient().then((client) => client
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT));
      this.createProgressText = `Please confirm popup 3 of 5\n\n Creating ${this.newWord} Token Contract`;
      await token.methods.init(`${this.newWord} Token`, 18, this.newWord,
        tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      this.addToken(token.deployInfo.address);
      this.createProgressText = `Please confirm popup 4 of 5\n\n Registering ${this.newWord} Token for sale`;
      await tokenSale.methods.set_token(token.deployInfo.address);
      this.createProgressText = `Please confirm popup 5 of 5\n\n Adding Token Sale for ${this.newWord} to Word Bazaar`;

      const wordRegistry = await getClient().then((client) => client
        .getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: process.env.VUE_APP_WORD_REGISTRY_ADDRESS }));
      await wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await Backend.invalidateWordRegistryCache();

      await this.updateWords();
      this.createProgressText = null;
    },
    async addToken(address) {
      await Backend.addToken(address);
      EventBus.$emit('reloadData');
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

.not-bootstrap-modal ::v-deep .not-bootstrap-modal-content {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin: 0 -33rem;
  white-space: pre-line;
  padding: 1rem;
  width: 34rem;
}
</style>
