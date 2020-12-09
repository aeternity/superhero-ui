<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <div class="steps">
      <div
        v-for="i in 5"
        :key="i"
        class="step"
        :class="{ active: step >= i }"
      />
    </div>
    <div class="input-group mb-2">
      <input
        v-model="newWord"
        class="form-control"
      >
      <OutlinedButton
        class="green"
        @click="createWordSale"
      >
        <Loading
          v-if="loadingState"
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
  </div>
</template>

<script>
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import BONDING_CURVE_MOCK from 'wordbazaar-contracts/BondingCurveMock.aes';
import Backend from '../utils/backend';
import Loading from './Loading.vue';
import { getClient } from '../utils/aeternity';
import { EventBus } from '../utils/eventBus';
import OutlinedButton from './OutlinedButton.vue';
import Modal from './Modal.vue';

export default {
  name: 'WordListing',
  components: {
    Loading,
    OutlinedButton,
    Modal,
  },
  props: {
    word: { type: String, default: null },
    sale: { type: String, default: null },
    heading: { type: Boolean },
  },
  data: () => ({
    newWord: '',
    loadingState: false,
    step: 1,
    createProgressText: null,
  }),
  methods: {
    async createWordSale() {
      this.loadingState = true;
      const bondingCurveMock = await getClient().then((client) => client
        .getContractInstance(BONDING_CURVE_MOCK));
      this.createProgressText = `Please confirm popup 1 of 5\n\n Creating Bonding Curve Contract for sale of ${this.newWord} Tokens`;
      await bondingCurveMock.deploy();
      const tokenSale = await getClient().then((client) => client
        .getContractInstance(TOKEN_SALE_CONTRACT));
      this.createProgressText = `Please confirm popup 2 of 5\n\n Creating Token Sale Contract for ${this.newWord} Tokens`;
      await tokenSale.methods.init(20, bondingCurveMock.deployInfo.address, 'description');
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

.steps {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .step {
    height: 0.8rem;

    background: #0F0F0F;
    /* SH Neo UIBG1 */

    border: 1px solid #0F0F0F;
    box-sizing: border-box;
    box-shadow: inset -2px 3px 6px rgba(0, 0, 0, 0.25);

    border-radius: 6px;

    /* Inside Auto Layout */

    flex: none;
    order: 0;
    flex-grow: 1;
    margin: 16px 0px;

    &.active {
      background: $custom_links_color;
      box-shadow: inset 0 0 6px 1px rgba(red($custom_links_color), green($custom_links_color), blue($custom_links_color), 0.4);
    }
  }
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
