<template>
  <div>
    <!-- eslint-disable vue-i18n/no-raw-text -->
    <div class="create-header">
      <div class="create-header-content">
        <h2>Create Your Token</h2>
        <h3>In Less Than 5 Minutes</h3>
        <span class="step-description">{{ stepDescription }}</span>
      </div>
    </div>
    <div class="steps">
      <div
        v-for="i in 6"
        :key="i"
        class="step"
      >
        <div
          class="step-box"
          :class="{ active: step >= i, pulse: (step === i && step !== 1) }"
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
          :disabled="loadingState"
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
          :disabled="loadingState"
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
          :disabled="loadingState"
        >

        <AeButton
          :disabled="loadingState"
          @click="createWordSale"
        >
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
import WORD_REGISTRY_CONTRACT from 'wordbazaar-contracts/WordRegistry.aes';
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import BONDING_CURVE from 'sophia-bonding-curve/BondCurveLinear.aes';
import Backend from '../utils/backend';
import Loading from './Loading.vue';
import { getClient } from '../utils/aeternity';
import { EventBus } from '../utils/eventBus';
import AeButton from './AeButton.vue';
import { shiftDecimalPlaces } from '../utils';

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
    navigateAssets: { type: Function, required: true },
  },
  data: () => ({
    name: '',
    description: '',
    ticker: '',
    loadingState: false,
    step: 1,
    stepDescription: 'Please fill in the fields below with your token details.',
  }),
  methods: {
    async createWordSale() {
      const decimals = 18;

      const BONDING_CURVE_DECIMALS = BONDING_CURVE.replace(
        'function alpha() : Frac.frac = Frac.make_frac(1, 1)',
        `function alpha() : Frac.frac = Frac.make_frac(1, ${shiftDecimalPlaces(1, decimals)})`,
      );

      this.loadingState = true;
      const bondingCurveMock = await getClient()
        .then((client) => client.getContractInstance(BONDING_CURVE_DECIMALS));

      const TOKEN_SALE_CONTRACT_DECIMALS = TOKEN_SALE_CONTRACT.replace(
        'let decimals = 1',
        `let decimals = ${shiftDecimalPlaces(1, decimals)}`,
      );

      this.step = 2;
      this.stepDescription = `Creating ${this.ticker} Bonding Curve Contract... Please confirm the transaction!`;
      await bondingCurveMock.deploy();
      const tokenSale = await getClient()
        .then((client) => client.getContractInstance(TOKEN_SALE_CONTRACT_DECIMALS));

      this.step = 3;
      this.stepDescription = `Creating ${this.ticker} Token Sale Contract... Please confirm the transaction!`;
      await tokenSale.methods.init(20, bondingCurveMock.deployInfo.address, this.description);
      const token = await getClient()
        .then((client) => client.getContractInstance(FUNGIBLE_TOKEN_CONTRACT));

      this.step = 4;
      this.stepDescription = `Creating ${this.ticker} Token Contract... Please confirm the transaction!`;
      await token.methods.init(this.name, decimals, this.ticker, tokenSale.deployInfo.address.replace('ct_', 'ak_'));
      await Backend.addToken(token.deployInfo.address);
      EventBus.$emit('reloadData');

      this.step = 5;
      this.stepDescription = `Registering ${this.ticker} Token for sale... Please confirm the transaction!`;
      await tokenSale.methods.set_token(token.deployInfo.address);

      this.step = 6;
      this.stepDescription = `Adding ${this.ticker} Sale to Word Bazaar... Please confirm the transaction!`;
      const wordRegistry = await getClient()
        .then((client) => client.getContractInstance(WORD_REGISTRY_CONTRACT,
          { contractAddress: process.env.VUE_APP_WORD_REGISTRY_ADDRESS }));
      await wordRegistry.methods.add_token(tokenSale.deployInfo.address);
      await Backend.invalidateWordRegistryCache();
      EventBus.$emit('reloadData');

      this.loadingState = false;
      this.stepDescription = 'Please fill in the fields below with your token details.';
      this.step = 1;

      this.navigateAssets();
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
    background-repeat: no-repeat;
    mix-blend-mode: luminosity;
  }

  .create-header-content {
    padding: 1.2rem 0 1.2rem 0;
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

    .step-description {
      font-size: 0.75rem;
      font-weight: 500;
      color: $pure_white;
      margin-top: 1rem;
    }
  }
}

.steps {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .step {
    flex-grow: 1;
    margin: 0 0.4rem 1.6rem 0.4rem;
    position: relative;

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

        &.pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%,
          100% {
            filter: saturate(0.5) brightness(0.5);
          }

          50% {
            filter: saturate(1) brightness(1);
          }
        }
      }
    }
  }
}

.create-inputs {
  display: flex;
  flex-direction: column;
}

</style>
