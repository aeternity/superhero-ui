<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <div class="create-header">
      <div class="create-header-content">
        <h2>Create Your Token</h2>
        <h3>In Less Than 5 Minutes</h3>
      </div>
    </div>
    <div class="steps">
      <div
        v-for="i in 5"
        :key="i"
        class="step"
      >
        <span
          v-if="step === i"
          class="step-title"
        >
          Token info
        </span>
        <div
          class="step-box"
          :class="{ active: step >= i }"
        />
      </div>
    </div>
    <div class="create-inputs input-group">
      <div>
        <label for="name">Tokenized asset</label>
        <input
          id="name"
          v-model="name"
          placeholder="Enter any combination of characters *"
          class="form-control"
          minlength="1"
          maxlength="333"
        >
      </div>

      <div>
        <label for="description">Token Description</label>
        <input
          id="description"
          v-model="description"
          placeholder="Enter additional information about your token or community *"
          class="form-control"
          minlength="1"
          maxlength="500"
        >
      </div>

      <div>
        <label for="ticker">Token short name</label>
        <input
          id="ticker"
          v-model="ticker"
          placeholder="Enter token ticker *"
          class="form-control"
          minlength="1"
          maxlength="6"
        >

        <AeButton @click="createWordSale">
          <Loading
            v-if="loadingState"
            small
            class="p-0"
          />
          <span v-else>Create Token</span>
        </AeButton>
      </div>
    </div>
  </div>
</template>

<script>
import Backend from '../utils/backend';
import Loading from './Loading.vue';
import { EventBus } from '../utils/eventBus';
import AeButton from './AeButton.vue';

export default {
  name: 'WordListing',
  components: {
    AeButton,
    Loading,
  },
  props: {
    word: { type: String, default: null },
    sale: { type: String, default: null },
    heading: { type: Boolean },
  },
  data: () => ({
    name: '',
    description: '',
    ticker: '',
    loadingState: false,
    step: 1,
    createProgressText: null,
  }),
  methods: {
    async createWordSale() {
      this.loadingState = true;

      this.step = 1;
      // `Please confirm popup 1 of 5\n\n Creating Bonding Curve Contract for sale`;
      const bondingCurve = await this.$store.dispatch('deployBondingCurve');

      this.step = 2;
      // `Please confirm popup 2 of 5\n\n Creating Token Sale Contract for ${this.newWord} Tokens`;
      const tokenSaleAddress = await this.$store.dispatch('deployTokenSaleContract',
        20, bondingCurve.deployInfo.address);

      this.step = 3;
      // `Please confirm popup 3 of 5\n\n Creating ${this.newWord} Token Contract`;
      const fungibleTokenAddress = await this.$store.dispatch('deployFungibleTokenContract', `${this.newWord} Token`, 18, this.newWord,
        tokenSaleAddress.replace('ct_', 'ak_'));
      this.addToken(fungibleTokenAddress);

      this.step = 4;
      // `Please confirm popup 4 of 5\n\n Registering ${this.newWord} Token for sale`;
      await this.$store.dispatch('tokenSaleMethod', this.saleContractAddress, 'set_token', fungibleTokenAddress);

      this.step = 5;
      // `Please confirm popup 5 of 5\n\n Adding Token Sale for ${this.newWord} to Word Bazaar`;
      await this.$store.dispatch('wordRegistryAddToken', tokenSaleAddress);
      await Backend.invalidateWordRegistryCache();

      await this.updateWords();
      this.loadingState = false;
      this.step = 1;
    },
    async addToken(address) {
      await Backend.addToken(address);
      EventBus.$emit('reloadData');
    },
  },
};
</script>

<style lang="scss" scoped>

.create-header {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/createTokenBg.svg');
    filter: grayscale(100%);
  }

  .create-header-content {
    padding: 1.2rem 0 2.2rem 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-size: 1.6rem;
      font-weight: bold;
      color: $pure_white;
    }

    h3 {
      font-size: 1rem;
      font-weight: normal;
      color: $tip_note_color;
    }
  }
}

.steps {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .step {
    flex-grow: 1;
    margin: 0.8rem 0.4rem;
    position: relative;

    .step-title {
      position: absolute;
      margin-top: -1.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      z-index: 10;
      text-align: center;
      width: 100%;
    }

    .step-box {
      height: 0.8rem;
      background: $super_dark;
      border: 1px solid $super_dark;
      box-sizing: border-box;
      box-shadow: inset -0.1rem 0.15rem 0.3rem rgba(0, 0, 0, 0.25);
      border-radius: 0.3rem;

      &.active {
        background: $custom_links_color;
        box-shadow:
          inset 0 0 0.3rem 0.05rem
          rgba(
            red($custom_links_color),
            green($custom_links_color),
            blue($custom_links_color),
            0.4
          );
      }
    }
  }
}

.create-inputs {
  display: flex;
  flex-direction: column;
}

</style>
