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
          Buy
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
          Sell
        </OutlinedButton>
      </div>
    </Modal>
  </div>
</template>

<script>
import FUNGIBLE_TOKEN_CONTRACT from 'wordbazaar-contracts/FungibleTokenCustom.aes';
import TOKEN_SALE_CONTRACT from 'wordbazaar-contracts/TokenSale.aes';
import { client, createOrChangeAllowance } from '@/utils/aeternity';
import backend from '@/utils/backend';
import util from '@/utils/util';
import { EventBus } from '@/utils/eventBus';
import { mapState } from 'vuex';
import AeAmount from '@/components/AeAmount.vue';
import Loading from '@/components/Loading.vue';
import OutlinedButton from '@/components/OutlinedButton.vue';
import Modal from '@/components/Modal.vue';
import AeAmountFiat from '@/components/AeAmountFiat.vue';

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
    spread: 0,
    totalSupply: null,
    tokenAddress: null,
    tokenContract: null,
    showBuyModal: false,
    showSellModal: false,
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
      this.contract = this.contract ? this.contract : await client
        .getContractInstance(TOKEN_SALE_CONTRACT, { contractAddress: this.sale });
      this.spread = util.shiftDecimalPlaces(
        (await this.contract.methods.spread()).decodedResult, -18,
      ).toFixed();

      this.tokenAddress = (await this.contract.methods.get_token()).decodedResult;
      this.tokenContract = this.tokenContract ? this.tokenContract : await client
        .getContractInstance(FUNGIBLE_TOKEN_CONTRACT, { contractAddress: this.tokenAddress });

      this.totalSupply = (await this.tokenContract.methods.total_supply()).decodedResult;

      const [buy, sell] = (await this.contract.methods.prices()).decodedResult;
      this.buyPrice = 1 / buy;
      this.sellPrice = 1 / sell;
    },
    async buy() {
      await this.contract.methods
        .buy({ amount: util.shiftDecimalPlaces(this.buyAmount, 18).toFixed() });
      const token = (await this.contract.methods.get_token()).decodedResult;
      await backend.invalidateTokenCache(token);
      EventBus.$emit('reloadData');
      this.loadWordData();
    },
    async sell() {
      const amount = util.shiftDecimalPlaces(this.sellAmount, 18).toFixed();
      const token = (await this.contract.methods.get_token()).decodedResult;
      await createOrChangeAllowance(token, amount,
        this.contract.deployInfo.address.replace('ct_', 'ak_'));
      await this.contract.methods.sell(amount);
      EventBus.$emit('reloadData');
      this.loadWordData();
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
