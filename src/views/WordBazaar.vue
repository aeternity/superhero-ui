<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <h1>Word Bazaar Prototype</h1>
    <!-- eslint-disable vue/html-self-closing -->
    <input v-model="newWord" />
    <button @click="createWordSale">
      <!-- eslint-disable vue-i18n/no-raw-text -->
      Create Word
    </button>
    <div class="row">
      <div class="col-md-3">Asset</div>
      <div class="col-md-3">Price</div>
      <div class="col-md-3">Supply</div>
      <div class="col-md-3">Market</div>
    </div>
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
</template>

<script>
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import { client } from '@/utils/aeternity';
import backend from '@/utils/backend';
import { mapState } from 'vuex';
import WordListing from '@/components/WordListing.vue';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
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
  }),
  computed: {
    ...mapState(['address']),
  },
  mounted() {
    setTimeout(this.updateWords, 5000);
  },
  methods: {
    async updateWords() {
      this.wordRegistry = await client
        .getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: 'ct_UXU3jSUHS2Zy1YkqUBjm1Aw31uBmc6bHKMmwPMRt8N9sN7HmW' });
      this.wordRegistryState = (await this.wordRegistry.methods.get_state()).decodedResult;
    },
    async createWordSale() {
      const tokenSale = await client.getContractInstance(TOKEN_SALE_CONTRACT);
      await tokenSale.methods.init(20);
      const token = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      await token.methods.init(`${this.newWord} Token`, 18, this.newWord,
        tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      await backend.addToken(token.deployInfo.address);
      await tokenSale.methods.set_token(token.deployInfo.address);
      await this.wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await this.updateWords();
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
