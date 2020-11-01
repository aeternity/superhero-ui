<template>
  <div class="row">
    <div class="col-md-3">
      <RouterLink
        class="link"
        :to="{ name: 'word-detail', params: { word } }"
      >
        {{ word }}
      </RouterLink>
    </div>
    <div class="col-md-3">
      <AeAmount
        v-if="buyPrice"
        :amount="buyPrice"
      />
      <Loading
        v-else
        :small="true"
      />
    </div>
    <div class="col-md-3">
      <AeAmount
        v-if="totalSupply !== null && tokenAddress"
        :amount="totalSupply"
        :token="tokenAddress"
      />
      <Loading
        v-else
        :small="true"
      />
    </div>

    <div class="col-md-3">
      <OutlinedButton
        class="green unpadded mr-1"
        @click="showBuyModal = true"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
        Buy
      </OutlinedButton>

      <OutlinedButton
        class="red unpadded"
        @click="showSellModal = true"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
        Sell
      </OutlinedButton>
    </div>

    <Modal
      v-if="showBuyModal"
      @close="showBuyModal = false"
    >
      <div class="label">
        Account Balance
      </div>
      <AeAmount
        :amount="tokenBalance"
        :token="tokenAddress"
      />
      <div class="mt-3 label">
        Amount buying
      </div>
      <div class="input-group mb-2">
        <input
          v-model="buyAmount"
          type="number"
          maxlength="90"
          class="form-control"
        >
      </div>
      <div class="mt-3 label">
        Total you pay
      </div>
      <AeAmountFiat :amount="buyAmount * buyPrice" />
      <div class="mt-3 text-center">
        <OutlinedButton
          class="green"
          @click="buy"
        >
          <!-- eslint-disable vue-i18n/no-raw-text -->
          <Loading
            v-if="loading"
            small
            class="p-0"
          />
          <span v-else>Buy</span>
        </OutlinedButton>
      </div>
    </Modal>

    <Modal
      v-if="showSellModal"
      @close="showSellModal = false"
    >
      <div class="label">
        Account Balance
      </div>
      <AeAmount
        :amount="tokenBalance"
        :token="tokenAddress"
      />
      <div class="mt-3 label">
        Amount selling
      </div>
      <div class="input-group mb-2">
        <input
          v-model="sellAmount"
          type="number"
          maxlength="90"
          class="form-control"
        >
      </div>
      <div class="mt-3 label">
        Total you get
      </div>
      <AeAmountFiat :amount="sellAmount * sellPrice" />
      <div class="mt-3 text-center">
        <OutlinedButton
          class="red"
          @click="sell"
        >
          <!-- eslint-disable vue-i18n/no-raw-text -->
          <Loading
            v-if="loading"
            small
            class="p-0"
          />
          <span v-else>Sell</span>
        </OutlinedButton>
      </div>
    </Modal>
  </div>
</template>

<script>
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import { mapState } from 'vuex';
import { client, createOrChangeAllowance } from '../utils/aeternity';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import AeAmount from './AeAmount.vue';
import Loading from './Loading.vue';
import OutlinedButton from './OutlinedButton.vue';
import Modal from './Modal.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import { shiftDecimalPlaces } from '../utils';

export default {
  name: 'WordListing',
  components: {
    AeAmountFiat,
    AeAmount,
    Loading,
    OutlinedButton,
    Modal,
  },
  props: {
    word: { type: String, required: true },
    sale: { type: String, required: true },
  },
  data: () => ({
    contract: null,
    buyPrice: null,
    sellPrice: null,
    buyAmount: 0,
    sellAmount: 0,
    totalSupply: null,
    tokenAddress: null,
    tokenContract: null,
    showBuyModal: false,
    showSellModal: false,
    loading: true,
  }),
  computed: {
    ...mapState(['address', 'balance', 'tokenBalances']),
    tokenBalance() {
      const balance = this.tokenBalances && this.tokenAddress
        && this.tokenBalances.find((t) => t.token === this.tokenAddress);

      return balance ? balance.balance : '0';
    },
  },
  mounted() {
    this.loadWordData();
  },
  methods: {
    async loadWordData() {
      this.totalSupply = null;
      this.buyPrice = null;

      const data = await Backend.getWordSale(this.sale);
      this.tokenAddress = data.tokenAddress;
      this.totalSupply = data.totalSupply;
      this.buyPrice = data.buyPrice;
      this.sellPrice = data.sellPrice;

      this.loading = false;
      this.buyAmount = 0;
      this.sellAmount = 0;
      this.showSellModal = false;
      this.showBuyModal = false;
    },
    async buy() {
      this.loading = true;

      await this.initContract();
      await this.contract.methods
        .buy({ amount: shiftDecimalPlaces(this.buyAmount, 18).toFixed() });

      await Backend.invalidateTokenCache(this.tokenAddress);
      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
      this.loadWordData();
    },
    async sell() {
      this.loading = true;

      await this.initContract();
      const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      await createOrChangeAllowance(this.tokenAddress, amount,
        this.contract.deployInfo.address.replace('ct_', 'ak_'));
      await this.contract.methods.sell(amount);

      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
      this.loadWordData();
    },
    async initContract() {
      this.contract = this.contract ? this.contract : await client
        .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress: this.sale });
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  color: $secondary_color;
  text-decoration: none;
}

h2 {
  margin-top: 1rem;
}

.not-bootstrap-modal ::v-deep .not-bootstrap-modal-content {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin: 1.9rem -13.6rem;
  padding: 1rem;

  @include smallest {
    min-width: 16rem;
    padding: 0.5rem;
  }
}

.label {
  color: $light_font_color;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;

  @include desktop {
    margin-bottom: 0.4rem;
    line-height: 0.9rem;
  }
}
</style>
