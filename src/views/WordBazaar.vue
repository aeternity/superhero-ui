<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <h1>Word Bazaar Prototype</h1>

    <div class="input-group mb-2">
      <!-- eslint-disable vue/html-self-closing -->
      <input
        v-model="newWord"
        class="form-control"
      >
      <OutlinedButton
        class="green"
        @click="createWordSale"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
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

    <div class="row">
      <div class="col-md-3">
        Asset
      </div>
      <div class="col-md-3">
        Price
      </div>
      <div class="col-md-3">
        Supply
      </div>
      <div class="col-md-3">
        Market
      </div>
    </div>

    <Loading
      v-if="loadingState && wordRegistryState === null"
      above-content
    />

    <div v-else>
      <div
        v-for="[word, sale] in wordRegistryState && wordRegistryState.tokens"
        :key="word"
        class="mb-2"
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
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loading from '../components/Loading.vue';
import OutlinedButton from '../components/OutlinedButton.vue';
import { EventBus } from '../utils/eventBus';
import Modal from '../components/Modal.vue';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
    Loading,
    OutlinedButton,
    Modal,
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
      this.createProgressText = `Please confirm popup 1 of 5\n\n Creating Bonding Curve Contract for sale of ${this.newWord} Tokens`;
      const bondingCurve = await this.$store.dispatch('deployBondingCurve');
      this.createProgressText = `Please confirm popup 2 of 5\n\n Creating Token Sale Contract for ${this.newWord} Tokens`;
      const tokenSaleAddress = await this.$store.dispatch('deployTokenSaleContract',
        20, bondingCurve.deployInfo.address);

      this.createProgressText = `Please confirm popup 3 of 5\n\n Creating ${this.newWord} Token Contract`;
      const fungibleTokenAddress = await this.$store.dispatch('deployFungibleTokenContract', `${this.newWord} Token`, 18, this.newWord,
        tokenSaleAddress.replace('ct_', 'ak_'));

      this.addToken(fungibleTokenAddress);
      this.createProgressText = `Please confirm popup 4 of 5\n\n Registering ${this.newWord} Token for sale`;
      await this.$store.dispatch('tokenSaleMethod', this.saleContractAddress, 'set_token', fungibleTokenAddress);
      this.createProgressText = `Please confirm popup 5 of 5\n\n Adding Token Sale for ${this.newWord} to Word Bazaar`;

      await this.$store.dispatch('wordRegistryAddToken', tokenSaleAddress);
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
