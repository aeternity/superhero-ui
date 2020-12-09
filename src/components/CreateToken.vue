<template>
  <!-- eslint-disable vue-i18n/no-raw-text -->
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
</template>

<script>
import Backend from '../utils/backend';
import Loading from './Loading.vue';
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
    createProgressText: null,
  }),
  methods: {
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

.not-bootstrap-modal ::v-deep .not-bootstrap-modal-content {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin: 0 -33rem;
  white-space: pre-line;
  padding: 1rem;
  width: 34rem;
}

</style>
