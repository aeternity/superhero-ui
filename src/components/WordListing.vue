<template>
  <div>
    <div
      v-if="heading"
      class="word-listing word-listing-heading"
    >
      <div class="word-listing-column asset-column">
        <ButtonPlain
          @click="order('asset', 'desc')"
        >
          <span class="heading-text mobile">
            {{ $t('components.WordListing.AssetMobile') }}
          </span>
          <span class="heading-text desktop">
            {{ $t('components.WordListing.Asset') }}
          </span>
        </ButtonPlain>
        <ButtonPlain @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')">
          <IconSort
            v-if="ordering === 'asset'"
            :class="{ asc: direction === 'asc' }"
          />
        </ButtonPlain>
      </div>

      <div class="word-listing-column">
        <ButtonPlain
          :class="{ green: showBuy, red: !showBuy }"
          @click="switchBuySell"
        >
          <template v-if="showBuy">
            <span class="heading-text mobile">
              {{ $t('components.WordListing.BuyPriceMobile') }}
            </span>
            <span class="heading-text desktop">
              {{ $t('components.WordListing.BuyPrice') }}
            </span>
          </template>
          <template v-else>
            <span class="heading-text mobile">
              {{ $t('components.WordListing.SellPriceMobile') }}
            </span>
            <span class="heading-text desktop">
              {{ $t('components.WordListing.SellPrice') }}
            </span>
          </template>
        </ButtonPlain>
        <ButtonPlain @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')">
          <IconSort
            v-if="ordering === 'buyprice' || ordering === 'sellprice'"
            :class="{ asc: direction === 'asc' }"
          />
        </ButtonPlain>
      </div>

      <div class="word-listing-column">
        <ButtonPlain @click="order('supply', 'desc')">
          <span class="heading-text">
            {{ $t('components.WordListing.Supply') }}
          </span>
        </ButtonPlain>
        <ButtonPlain @click="order(ordering, direction === 'asc' ? 'desc' : 'asc')">
          <IconSort
            v-if="ordering === 'supply'"
            :class="{ asc: direction === 'asc' }"
          />
        </ButtonPlain>
      </div>

      <div class="word-listing-column market-column">
        <span class="heading-text">{{ $t('components.WordListing.Market') }}</span>
      </div>
    </div>

    <RouterLink
      v-else
      class="word-listing word-row"
      tag="div"
      :to="{ name: 'word-detail', params: { word: data.word } }"
    >
      <TokenAvatarAndSymbol
        :address="data.tokenAddress"
        class="word-listing-column asset-column"
      />
      <div class="word-listing-column">
        <AeAmountFiat
          :amount="showBuyValue ? data.buyPrice : data.sellPrice"
          aettos
          no-parentheses
          @click.native.stop
        />
      </div>
      <div class="word-listing-column">
        <AeAmount
          :amount="data.totalSupply"
          :token="data.tokenAddress"
          no-symbol
          class="supply"
          @click.native.stop
        />
      </div>

      <WordBuySellButtons
        class="word-listing-column market-column"
        :sale="data.sale"
        @click.native.stop
      />
    </RouterLink>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AeAmountFiat from './AeAmountFiat.vue';
import AeAmount from './AeAmount.vue';
import WordBuySellButtons from './WordBuySellButtons.vue';
import IconSort from '../assets/iconSort.svg?icon-component';
import TokenAvatarAndSymbol from './fungibleTokens/TokenAvatarAndSymbol.vue';
import ButtonPlain from './ButtonPlain.vue';

export default {
  name: 'WordListing',
  components: {
    WordBuySellButtons,
    AeAmountFiat,
    AeAmount,
    IconSort,
    TokenAvatarAndSymbol,
    ButtonPlain,
  },
  props: {
    data: { type: Object, default: null },
    heading: { type: Boolean },
    showBuyValue: { type: Boolean },
  },
  data: () => ({
    ordering: 'buyprice',
    direction: 'desc',
    showBuy: true,
  }),
  computed: {
    ...mapState(['address', 'balance', 'tokenBalances']),
    tokenBalance() {
      const balance = this.tokenBalances && this.data.tokenAddress
        && this.tokenBalances.find((t) => t.token === this.data.tokenAddress);

      return balance ? balance.balance : '0';
    },
  },
  methods: {
    switchBuySell() {
      this.showBuy = !this.showBuy;
      this.ordering = this.showBuy ? 'buyprice' : 'sellprice';
      this.$emit('show-buy', this.showBuy);
    },
    order(ordering, direction) {
      this.ordering = ordering;
      this.direction = direction;
      this.$emit('order', ordering, direction);
    },
  },
};
</script>

<style lang="scss" scoped>
.word-listing {
  color: $light_font_color;
  align-items: center;
  font-size: 15px;
  padding: 8px 0;
  margin-bottom: 1px;
  transition: background-color 0.3s;
  background-color: $light_color;
  display: flex;
  height: 48px;

  &.word-row {
    &:hover {
      background-color: $buttons_background;
      cursor: pointer;
    }
  }

  .iconSort {
    margin-top: -0.2rem;
    height: 24px;
    color: $standard_font_color;
    transition: color 0.3s;

    &.asc {
      transform: rotate(180deg);
    }

    &:hover {
      color: $custom_links_color;
    }
  }

  .button-plain {
    &.green {
      color: $custom_links_color;
    }

    &.red {
      color: $red_color;
      margin-right: 1px;
    }
  }

  .heading-text {
    transition: color 0.3s;
    font-size: 16px;

    &.mobile {
      display: none;
    }

    @include desktop {
      &.mobile { display: inline-block; }
      &.desktop { display: none; }
    }
  }

  .word-listing-column {
    flex: 0 1 20%;
    width: 20%;

    .supply {
      color: $tip_note_color;
    }

    @include desktop {
      &:last-of-type {
        display: flex;

        ::v-deep .buttons {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .outlined-button {
            margin-right: 0;
            height: 24px;
            width: 43px;
            font-size: 15px;
            line-height: 19px;
            padding: 0;

            &:not(:last-child) {
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    @include desktop-only {
      &:last-of-type {
        min-width: 140px;
      }
    }
  }

  @include desktop {
    height: 72px;
    border-radius: 4px;
    font-size: 14px;
    align-items: flex-start;

    ::v-deep .token-avatar-and-symbol {
      flex-direction: column-reverse;
      align-items: flex-start;

      .symbol {
        font-size: 14px;
      }
    }

    .ae-amount-fiat {
      display: flex;
      flex-direction: column;
    }
  }

  &.word-listing-heading {
    height: 56px;
    font-size: 16px;
    font-weight: 500;

    svg {
      height: 16px;
    }

    @include desktop {
      height: 40px;
      border: 1px solid $background_color;
      box-sizing: border-box;
      border-radius: 0 0 4px 4px;

      .heading-text {
        font-size: 15px;
        line-height: 24px;
      }
    }
  }

  .asset-column {
    font-weight: 500;
    min-width: 220px;
    padding-left: 4px;

    @include mobile {
      min-width: 160px;
    }
  }

  ::v-deep .token-avatar-and-symbol {
    .avatar {
      width: 32px;
      height: 32px;
    }

    .symbol {
      font-size: 15px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      @include desktop {
        margin-left: 0;
      }
    }
  }

  .word-listinglabel {
    color: $light_font_color;
    font-size: 0.7rem;
    margin-bottom: 0.5rem;

    @include desktop {
      margin-bottom: 0.4rem;
      line-height: 0.9rem;
    }
  }

  ::v-deep .word-buy-sell-buttons {
    .buy-modal {
      .not-bootstrap-modal-content {
        margin-left: -204px;

        @include desktop {
          margin-left: -260px;
          margin-top: 24px;
        }
      }
    }

    .sell-modal {
      .not-bootstrap-modal-content {
        @include desktop {
          margin-left: -260px;
          margin-top: 56px;
        }
      }
    }
  }
}
</style>
