<template>
  <div class="overview">
    <div
      v-if="stats.total_tips_length"
      class="overview__item"
    >
      <div class="overview__value">
        {{ stats.total_tips_length }}
      </div>
      <div class="overview__label">
        Tips Aggregated
      </div>
    </div>
    <div
      v-if="stats.comments"
      class="overview__item"
    >
      <div class="overview__value">
        {{ stats.comments.total }}
      </div>
      <div class="overview__label">
        Comments
      </div>
    </div>
    <div
      v-if="stats.senders_length"
      class="overview__item"
    >
      <div class="overview__value">
        {{ stats.senders_length }}
      </div>
      <div class="overview__label">
        Unique Tip Senders
      </div>
    </div>
    <div
      v-if="stats.total_amount"
      class="overview__item"
    >
      <div class="overview__value secondary">
        <ae-amount
          :amount="stats.total_amount"
          :round="2"
        />
      </div>
      <div
        v-if="stats.total_amount"
        class="overview__value"
      >
        <fiat-value
          :amount="stats.total_amount"
          :without-brackets="true"
        />
      </div>
      <div class="overview__label">
        Total Tips Value
      </div>
    </div>
    <div
      v-if="stats.height"
      class="overview__item"
    >
      <div class="overview__value">
        {{ stats.height }}
      </div>
      <div class="overview__label">
        Latest Block
      </div>
    </div>
    <div
      v-if="stats.height"
      class="overview__item"
    >
      <div class="overview__label">
        Powered by
      </div>
      <div class="overview__value">
        <img src="../../assets/aeternityLogo.svg">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FiatValue from '../FiatValue.vue';
import AeAmount from '../AeAmount.vue';

export default {
  name: 'Overview',
  components: {
    FiatValue,
    AeAmount,
  },
  computed: {
    ...mapGetters(['stats']),
  },
};
</script>

<style lang="scss">
  .overview {
    margin-top: 1rem;
  }

  .overview__item {
    margin-bottom: .5rem;
  }

  .overview__value {
    color: $custom_links_color;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1rem;

    &.secondary {
      color: $secondary_color;
      padding-bottom: 0;
    }

    .currency, .currency-sign, .ae {
      font-size: .8rem;
      padding-left: .25rem;
    }
  }

  .overview__label {
    color: $light_font_color;
    font-size: .75rem;
    font-weight: 400;
    line-height: .75rem;
    text-transform: none;
  }

  @media only screen and (min-width: 1440px) {
    .overview__value {
      font-size: 1.6rem;
      line-height: 1.6rem;
      padding-bottom: 0.3rem;
    }

    .overview__label {
      color: $light_font_color;
      font-size: .75rem;
      text-transform: none;
    }

    .overview__item {
      margin-bottom: 1.9rem;
    }

    .overview {
      margin-top: 2rem;
    }
  }
</style>
