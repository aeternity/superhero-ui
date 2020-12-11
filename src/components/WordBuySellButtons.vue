<template>
  <div>
    <div>
      <OutlinedButton
        class="green unpadded mr-1"
        @click="showBuyModal = true"
      >
        <!-- eslint-disable vue-i18n/no-raw-text -->
        Buy
      </OutlinedButton>

      <OutlinedButton
        class="red unpadded"
        :disabled="tokenBalance === 0"
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
          @change="buyValue"
        >
      </div>
      <div class="mt-3 label">
        Total you pay
      </div>
      <AeAmountFiat
        v-if="buyAeAmount"
        :amount="buyAeAmount"
        aettos
      />
      <Loading
        v-else
        small
        class="p-0"
      />
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
          @change="sellValue"
        >
      </div>
      <div class="mt-3 label">
        Total you get
      </div>
      <AeAmountFiat
        v-if="sellAeAmount"
        :amount="sellAeAmount"
        aettos
      />
      <Loading
        v-else
        small
        class="p-0"
      />      <div class="mt-3 text-center">
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
import BigNumber from 'bignumber.js';
import { getClient, createOrChangeAllowance } from '../utils/aeternity';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import AeAmount from './AeAmount.vue';
import Loading from './Loading.vue';
import OutlinedButton from './OutlinedButton.vue';
import Modal from './Modal.vue';
import AeAmountFiat from './AeAmountFiat.vue';
import { shiftDecimalPlaces } from '../utils';

export default {
  name: 'WordBuySellButtons',
  components: {
    AeAmountFiat,
    AeAmount,
    Loading,
    OutlinedButton,
    Modal,
  },
  props: {
    sale: { type: String, required: true },
  },
  data: () => ({
    contract: null,
    buyPrice: null,
    sellPrice: null,
    buyAmount: 1,
    sellAmount: 1,
    totalSupply: null,
    tokenAddress: null,
    tokenContract: null,
    buyAeAmount: null,
    sellAeAmount: null,
    showBuyModal: false,
    showSellModal: false,
    loading: true,
  }),
  computed: {
    ...mapState(['address', 'balance', 'tokenBalances']),
    tokenBalance() {
      const balance = this.tokenBalances && this.tokenAddress
        && this.tokenBalances.find((t) => t.token === this.tokenAddress);

      return new BigNumber(balance ? balance.balance : '0').toNumber();
    },
  },
  created() {
    this.reloadData();
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async reloadData() {
      this.totalSupply = null;
      this.buyPrice = null;

      const data = await Backend.getWordSale(this.sale);
      this.tokenAddress = data.tokenAddress;
      this.buyPrice = data.buyPrice;
      this.sellPrice = data.sellPrice;

      this.buyAmount = 1;
      this.sellAmount = 1;

      // just trigger loading
      this.buyValue();
      this.sellValue();

      this.loading = false;
      this.showSellModal = false;
      this.showBuyModal = false;
    },
    async buyValue() {
      await this.initContract();

      const amount = shiftDecimalPlaces(this.buyAmount, 18).toFixed();
      const value = await this.contract.methods.calculate_buy_price(amount)
        .then((r) => r.decodedResult);

      this.buyAeAmount = value;

      return { amount, value };
    },
    async sellValue() {
      await this.initContract();

      const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      this.sellAeAmount = await this.contract.methods.calculate_sell_return(amount)
        .then((r) => r.decodedResult);
    },
    async buy() {
      this.loading = true;

      await this.initContract();

      const { amount, value } = await this.buyValue();
      await this.contract.methods.buy(amount, { amount: value });

      await Backend.invalidateTokenCache(this.tokenAddress);
      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
    },
    async sell() {
      this.loading = true;

      await this.initContract();
      const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      await createOrChangeAllowance(this.tokenAddress, amount,
        this.contract.deployInfo.address.replace('ct_', 'ak_'));
      await this.contract.methods.sell(amount);

      await Backend.invalidateTokenCache(this.tokenAddress);
      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
    },
    async initContract() {
      this.contract = this.contract ? this.contract : await getClient().then((client) => client
        .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress: this.sale }));
    },
  },
};
</script>

<style lang="scss" scoped>
.not-bootstrap-modal ::v-deep .not-bootstrap-modal-content {
  background-color: $article_content_color;
  border-radius: 0.5rem;
  margin: 0 -6.3rem;
  padding: 1rem;

  @include smallest {
    min-width: 16rem;
    padding: 0.5rem;
  }
}
</style>
