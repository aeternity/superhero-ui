<template>
  <div>
    <h1>Word Bazaar Prototype</h1>
    <input v-model="newWord"/>
    <button @click="createWordSale">
      Create
    </button>
    <hr/>
    <a
      v-for="[word, sale] in wordRegistryState && wordRegistryState.tokens"
      :key="word"
      @click="selectWord(word, sale)"
    >
      {{ word }}
    </a>
    <div v-if="selectedWord">
      <h2>{{ selectedWord }}</h2>
      <div>
        <input
          v-model="buyAmount"
          type="number"
        />
        <button @click="buy">Buy</button>
      </div>
      <div>
        <input
          v-model="sellAmount"
          type="number"
        />
        <button @click="sell">Sell</button>
      </div>
    </div>
  </div>
</template>

<script>
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import { client, createOrChangeAllowance } from '@/utils/aeternity';
import backend from '@/utils/backend';
import util from '@/utils/util';
import { EventBus } from '@/utils/eventBus';

export default {
  name: 'WordBazaar',
  data: () => ({
    newWord: '',
    words: [],
    wordRegistryState: null,
    selectedWord: null,
    selectedWordContract: null,
    buyAmount: 0,
    sellAmount: 0,
  }),
  mounted() {
    setTimeout(this.updateWords, 5000);
  },
  methods: {
    async updateWords() {
      this.wordRegistry = await client
        .getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: 'ct_Ysp7MopPi1WjrdAKW3x7cfNugiaGXKXCCHouscQ4xy6WEd8ok' });
      this.wordRegistryState = (await this.wordRegistry.methods.get_state()).decodedResult;
    },
    async createWordSale() {
      const tokenSale = await client.getContractInstance(TOKEN_SALE_CONTRACT);
      await tokenSale.methods.init();
      const token = await client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT);
      await token.methods.init(`${this.newWord} Token`, 18, this.newWord,
        tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      await backend.addToken(token.deployInfo.address);
      await tokenSale.methods.set_token(token.deployInfo.address);
      await this.wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await this.updateWords();
    },
    async selectWord(word, sale) {
      this.selectedWordContract = await client
        .getContractInstance(TOKEN_SALE_CONTRACT, {contractAddress: sale});
      this.selectedWord = word;
    },
    async buy() {
      await this.selectedWordContract.methods
        .buy({amount: util.shiftDecimalPlaces(this.buyAmount, 18).toFixed()});
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      await backend.invalidateTokenCache(token);
      EventBus.$emit('reloadData');
    },
    async sell() {
      const amount = util.shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      const token = (await this.selectedWordContract.methods.get_token()).decodedResult;
      await createOrChangeAllowance(token, amount,
        this.selectedWordContract.deployInfo.address.replace('ct_', 'ak_'));
      await this.selectedWordContract.methods.sell(amount);
      EventBus.$emit('reloadData');
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  margin-right: .5rem;
  text-decoration: underline !important;
}
</style>
