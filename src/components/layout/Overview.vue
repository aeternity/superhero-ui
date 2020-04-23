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
      <ae-amount-fiat
        :amount="stats.total_amount"
        class="overview__value"
      />
      <div class="overview__label">
        Total Tips Value
      </div>
    </div>
    <div
      v-if="stats.total_claimed_amount"
      class="overview__item"
    >
      <ae-amount-fiat
        :amount="stats.total_claimed_amount"
        class="overview__value"
      />
      <div class="overview__label">
        Total Tips Claimed
      </div>
    </div>
    <div
      v-if="stats.height"
      class="overview__item"
    >
      <div class="overview__value latest-block">
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
import AeAmountFiat from '../AeAmountFiat.vue';

export default {
  name: 'Overview',
  components: {
    AeAmountFiat,
  },
  computed: {
    ...mapGetters(['stats']),
  },
};
</script>

<style lang="scss">
.overview {
  margin-top: 1.2rem;
}

.overview__item {
  margin-bottom: 0.5rem;
}

.overview__value {
  color: $custom_links_color;
  font-size: 1rem;
  line-height: 1.2rem;
  font-weight: 400;

  &.secondary {
    color: $secondary_color;
    padding-bottom: 0;
  }

  &.ae-amount-fiat {
    display: flex;
    flex-direction: column;
    color: $standard_font_color;

    .currency-value {
      font-size: 0.7rem;
      line-height: 1rem;
      color: $light_font_color;
    }
  }

  .currency,
  .currency-sign,
  .ae {
    font-size: 0.7rem;
    line-height: 0.8;
    padding-left: 0.25rem;
  }

  &.latest-block {
    color: $secondary_color;
  }
}

.overview__label {
  color: $light_font_color;
  font-size: 0.7rem;
  font-weight: 400;
  text-transform: none;
}

@media only screen and (max-width: 1280px) {
  .overview__value {
    line-height: 1.1rem;
  }

  .overview__item {
    margin-bottom: 0.4rem;
  }
}
</style>
