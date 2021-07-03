<template>
  <div class="word-detail">
    <BackButtonRibbon>
      <template #title>
        <span class="abbreviation">{{ word }}</span>
      </template>
    </BackButtonRibbon>

    <ActivityRibbon
      value=""
      :tabs="[]"
    >
      <template slot="left">
        <FilterButton
          :class="{ active: activity === 'info' }"
          @click="activity = 'info'"
        >
          <IconInfo />
          <span class="desktop">{{ $t('views.WordDetail.RibbonTabs.Info') }}</span>
          <span class="mobile">{{ $t('views.WordDetail.RibbonTabsMobile.Info') }}</span>
        </FilterButton>
        <FilterButton
          :class="{ active: activity === 'voting' }"
          @click="activity = 'voting'"
        >
          <IconPie />
          <span class="desktop">{{ $t('views.WordDetail.RibbonTabs.Vote') }}</span>
          <span class="mobile">{{ $t('views.WordDetail.RibbonTabsMobile.Vote') }}</span>
        </FilterButton>
      </template>
      <WordBuySellButtons
        v-if="saleContractAddress && activity === 'info'"
        slot="right"
        :sale="saleContractAddress"
      />
    </ActivityRibbon>

    <WordInfo
      v-if="activity === 'info'"
      :data="data"
      :selected-word="word"
      :sale-contract-address="saleContractAddress"
    />

    <WordVoting
      v-if="activity === 'voting'"
      :data="data"
      :selected-word="word"
      :sale-contract-address="saleContractAddress"
    />
  </div>
</template>

<script>
import Backend from '../utils/backend';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import WordBuySellButtons from '../components/WordBuySellButtons.vue';
import IconPie from '../assets/iconPie.svg?icon-component';
import IconInfo from '../assets/iconInfo.svg?icon-component';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import FilterButton from '../components/FilterButton.vue';
import WordVoting from '../components/WordVoting.vue';

export default {
  name: 'WordDetail',
  components: {
    ActivityRibbon,
    FilterButton,
    IconInfo,
    IconPie,
    WordBuySellButtons,
    BackButtonRibbon,
    WordVoting,
    WordInfo: () => import(/* webpackChunkName: "WordInfo" */ '../components/WordInfo.vue'),
  },
  props: {
    word: { type: String, required: true },
  },
  data() {
    return {
      wordRegistryState: null,
      saleContractAddress: '',
      data: {},
      activity: 'info',
    };
  },
  async mounted() {
    await this.reloadData();
    const interval = setInterval(() => this.reloadData(), 120 * 1000);
    this.$once('hook:beforeDestroy', () => clearInterval(interval));
  },
  methods: {
    async reloadData() {
      this.wordRegistryState = await Backend.getWordRegistry('', '', this.word);
      this.saleContractAddress = this.wordRegistryState
        .find(({ word }) => word === this.word).sale;
      this.data = await Backend.getWordSale(this.saleContractAddress);
    },
  },
  metaInfo() {
    return { title: this.$t('views.WordDetail.Title', { word: this.word }) };
  },
};
</script>

<style lang="scss" scoped>
.word-detail {
  width: 624px;
  background-color: $actions_ribbon_background_color;

  ::v-deep .activity-ribbon {
    box-sizing: border-box;
    position: sticky;
    top: 56px;
    height: 65px;
    border-bottom: 1px solid $actions_ribbon_background_color;
    margin: 0;
    z-index: 2;

    .filter-button {
      height: 40px;
      border-radius: 20px;
      font-size: 16px;

      svg,
      span {
        vertical-align: middle;
      }

      svg {
        height: 24px;
        flex-shrink: 0;
      }

      .desktop { margin-left: 2px; }
      .mobile { display: none; }

      @include desktop {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
        height: 56px;
        margin: 0;

        .mobile { display: inline; }
        .desktop { display: none; }

        &.active,
        &:hover {
          background-color: transparent;
        }
      }
    }

    .word-buy-sell-buttons {
      .buy-modal {
        .modal-content {
          margin-left: -204px;

          @include desktop {
            margin-left: -200px;
          }
        }
      }

      .sell-modal {
        .modal-content {
          @include desktop {
            margin-left: -120px;
          }
        }
      }
    }

    @include desktop {
      display: flex;

      @include mobile {
        top: 48px;
      }
    }
  }

  ::v-deep .tab-bar {
    height: 40px;
    font-size: 15px;
    position: sticky;
    top: 121px;
    z-index: 2;

    .button-plain {
      svg,
      span {
        vertical-align: middle;
      }

      .plus {
        transition: transform 0.5s;
        height: 20px;

        &.rotate {
          transform: rotate(45deg);
        }
      }

      .desktop {
        @include desktop {
          display: none;
        }
      }

      &:hover {
        .plus {
          color: $custom_links_color;

          &.rotate {
            color: $red_color;
          }
        }
      }
    }

    @include mobile {
      top: 113px;
    }
  }

  ::v-deep .asset_details__section {
    background-color: $actions_ribbon_background_color;
    font-weight: 500;
    font-size: 0.75rem;

    .asset-details__asset {
      padding-bottom: 16px;
    }

    .asset-details__description {
      color: $tip_note_color;
      padding-bottom: 16px;
    }

    .asset_details__section-content {
      padding: 8px 24px;
      font-size: 15px;
      font-weight: 400;

      h3 {
        margin-top: 0;
        margin-bottom: 8px;
      }

      .chart-buttons {
        .button-plain {
          padding: 8px 16px;
          font-weight: 500;
          font-size: 16px;
          line-height: 21px;
          color: $light_font_color;
          background-color: $light_color;
          opacity: 0.66;
          transition: 0.3s;
          transition-property: color, background-color, opacity;
          height: 40px;
          border: 1px solid $actions_ribbon_background_color;
          border-radius: 6px 6px 0 0;
          box-sizing: border-box;
          border-bottom: 0;

          &:hover:not(.active) {
            color: $tip_note_color;
            background-color: $tab_hover_color;
          }

          &.active {
            background-color: $chart_background_color;
            border-color: transparent;
            opacity: 1;
            cursor: default;
          }
        }
      }
    }
  }

  ::v-deep .asset_details__info {
    padding: 1.5rem;
    display: flex;
    flex-direction: row;

    @include desktop {
      flex-wrap: wrap;
    }

    .info-item {
      flex-shrink: 1;
      font-size: 15px;
      line-height: 19px;
      display: flex;
      flex-direction: column;
      background: $super_dark;
      box-shadow: 4px 4px 10px rgba($background_color, 0.2);
      border-radius: 6px;
      margin-right: 16px;
      padding: 16px;
      transition: background 0.3s;
      min-height: 112px;

      h3 {
        font-size: 15px;
        font-weight: 700;
        transition: color 0.3s;
        color: $light_font_color;
        margin-top: 0;
        margin-bottom: 9px;
        line-height: 1.2;
      }

      &:hover {
        background: $buttons_background;

        h3 {
          color: $tip_note_color;
        }
      }

      .abbreviation {
        display: block;
        width: 100%;
        word-wrap: break-word;
      }

      @include desktop {
        width: 44%;
        margin: 8px;
      }
    }
  }
}
</style>
