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
    step: 1,
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
