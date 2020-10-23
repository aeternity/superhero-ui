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
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import BONDING_CURVE_MOCK from 'wordbazaar-contracts/BondingCurveMock.aes';
import { mapState } from 'vuex';
import { client } from '../utils/aeternity';
import backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loading from '../components/Loading.vue';
import OutlinedButton from '../components/OutlinedButton.vue';
import { EventBus } from '../utils/eventBus';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
    Loading,
    OutlinedButton,
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
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    setTimeout(this.updateWords, 5000);
  },
  methods: {
    async updateWords() {
      this.loadingState = true;
      this.wordRegistry = await client
        .getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: process.env.VUE_APP_WORD_REGISTRY_ADDRESS });
      this.wordRegistryState = (await this.wordRegistry.methods.get_state()).decodedResult;
      this.loadingState = false;
      this.newWord = '';
    },
    async createWordSale() {
      this.loadingState = true;
      const bondingCurveMock = await client.getContractInstance(BONDING_CURVE_MOCK);
      await bondingCurveMock.deploy();
      const tokenSale = await client.getContractInstance(TOKEN_SALE_CONTRACT);
      await tokenSale.methods.init(20, bondingCurveMock.deployInfo.address);
      const token = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      await token.methods.init(`${this.newWord} Token`, 18, this.newWord,
        tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      this.addToken(token.deployInfo.address);
      await tokenSale.methods.set_token(token.deployInfo.address);
      await this.wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await this.updateWords();
    },
    async addToken(address) {
      await backend.addToken(address);
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
</style>
