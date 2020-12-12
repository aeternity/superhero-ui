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
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
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
    buyPrice: null,
    sellPrice: null,
    buyAmount: 1,
    sellAmount: 1,
    totalSupply: null,
    tokenAddress: null,
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
      const amount = shiftDecimalPlaces(this.buyAmount, 18).toFixed();

      const value = await this.$store.dispatch('aeternity/tokenSaleMethod',
        {
          contractAddress: this.sale,
          method: 'calculate_buy_price',
          args: [amount],
        });

      this.buyAeAmount = value;

      return { amount, value };
    },
    async sellValue() {
      const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      this.sellAeAmount = await this.$store.dispatch('aeternity/tokenSaleMethod',
        {
          contractAddress: this.sale,
          method: 'calculate_sell_return',
          args: [amount],
        }).catch(() => 0);
    },
    async buy() {
      this.loading = true;

      const { amount, value } = await this.buyValue();
      await this.$store.dispatch('aeternity/tokenSaleMethod',
        {
          contractAddress: this.sale,
          method: 'buy',
          args: [amount],
          options: { amount: value },
        });

      await Backend.invalidateTokenCache(this.tokenAddress);
      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
    },
    async sell() {
      this.loading = true;

      const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();

      await this.$store.dispatch('aeternity/createOrChangeAllowance',
        this.tokenAddress, amount, this.sale.replace('ct_', 'ak_'));
      await this.$store.dispatch('aeternity/tokenSaleMethod',
        {
          contractAddress: this.sale,
          method: 'sell',
          args: [amount],
        });

      await Backend.invalidateTokenCache(this.tokenAddress);
      await Backend.invalidateWordSaleCache(this.sale);
      EventBus.$emit('reloadData');
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
