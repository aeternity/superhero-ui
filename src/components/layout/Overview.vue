<template>
  <div
    class="overview"
    v-if="stats"
  >
    <div class="value">
      {{ stats.total_tips_length }}
    </div>
    <div class="label">
      {{ $t('components.layout.Overview.TipsAggregated') }}
    </div>

    <div class="value">
      {{ stats.comments.total }}
    </div>
    <div class="label">
      {{ $t('comments') }}
    </div>

    <div class="value">
      {{ stats.senders_length }}
    </div>
    <div class="label">
      {{ $t('components.layout.Overview.UniqueTipSenders') }}
    </div>

    <AeAmountFiat
      :amount="stats.total_amount"
      class="value"
    />
    <div class="label">
      {{ $t('components.layout.Overview.TotalTipsValue') }}
    </div>

    <AeAmountFiat
      :amount="stats.total_claimed_amount"
      class="value"
    />
    <div class="label">
      {{ $t('components.layout.Overview.TotalTipsClaimed') }}
    </div>

    <div class="value secondary">
      {{ stats.height }}
    </div>
    <div class="label">
      {{ $t('components.layout.Overview.LatestBlock') }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AeAmountFiat from '../AeAmountFiat.vue';

export default {
  name: 'Overview',
  components: { AeAmountFiat },
  computed: mapState('backend', ['stats']),
};
</script>

<style lang="scss" scoped>
.overview {
  margin-top: 1rem;

  .value {
    color: $custom_links_color;
    line-height: 1.2rem;

    @include desktop {
      line-height: 1rem;
    }

    &.ae-amount-fiat {
      display: block;

      ::v-deep {
        > * {
          display: block;
        }

        .ae-amount .ae {
          font-size: 0.7rem;
          padding-left: 0.25rem;
        }

        .currency-value {
          line-height: 1rem;
        }
      }
    }

    &.secondary {
      color: $secondary_color;
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
}
</style>
