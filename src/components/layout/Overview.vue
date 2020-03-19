<template>
  <div class="overview">
    <div class="overview__item" v-if="stats.total_tips_length">
      <div class="overview__value">
        {{ stats.total_tips_length }}
      </div>
      <div class="overview__label">
        Tips Aggregated
      </div>
    </div>
    <div class="overview__item" v-if="stats.comments">
      <div class="overview__value">
        {{ stats.comments.total }}
      </div>
      <div class="overview__label">
        Comments
      </div>
    </div>
    <div class="overview__item" v-if="stats.senders_length">
      <div class="overview__value">
        {{ stats.senders_length }}
      </div>
      <div class="overview__label">
        Unique Tip Senders
      </div>
    </div>
    <div class="overview__item" v-if="stats.total_amount">
      <div class="overview__value secondary">
        <ae-amount :amount="stats.total_amount" :round="2"/>
        <span class="currency secondary"> AE</span>
      </div>
      <div class="overview__value" v-if="stats.total_amount">
        <fiat-value :amount="stats.total_amount" :withoutBrackets="true"/>
      </div>
      <div class="overview__label">
        Total Tips Value
      </div>
    </div>
    <div class="overview__item" v-if="stats.height">
      <div class="overview__value">
        {{ stats.height }}
      </div>
      <div class="overview__label">
        Latest Block
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
    margin-top: 2rem;
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

    .currency, .currency-sign {
      font-size: .8rem;
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
  }
</style>
