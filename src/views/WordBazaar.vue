<template>
  <div class="word-bazaar">
    <BackButtonRibbon hide-back>
      <template #title>
        <span class="activity">
          {{ ribbonTabs.find((a) => a.activity === activity).header }}
        </span>
        <span class="activity-bubble">
          <BubbleArrow />
          <Component
            :is="ribbonTabs.find((a) => a.activity === activity).icon"
            class="activity-icon"
          />
        </span>
      </template>
    </BackButtonRibbon>

    <ActivityRibbon
      v-model="activity"
      class="mobile"
      :tabs="ribbonTabsMobile"
    />

    <ActivityRibbon
      v-model="activity"
      class="desktop"
      :tabs="ribbonTabs"
    />

    <template v-if="activity === 'assets'">
      <TabBar
        v-model="activeTab"
        class="desktop"
        :tabs="tabs"
      >
        <SearchInput
          v-if="showSearch"
          v-model="search"
          hide-eraser
          set-focused
          :placeholder="$t('views.WordBazaar.Placeholder')"
          @input="reloadData"
          @close="closeSearch"
        />
        <IconSearch
          v-else
          @click="showSearch = true"
        />
      </TabBar>

      <TabBar
        v-model="activeTab"
        class="mobile"
        :tabs="tabsMobile"
      >
        <SearchInput
          v-if="showSearch"
          v-model="search"
          hide-eraser
          set-focused
          :placeholder="$t('views.WordBazaar.Placeholder')"
          @input="reloadData"
          @close="closeSearch"
        />
        <IconSearch
          v-else
          @click="showSearch = true"
        />
      </TabBar>

      <WordListing
        heading
        @order="order"
        @show-buy="showBuyValue = $event"
      />

      <Loader
        v-if="wordRegistryState === null || loading"
        class="lg"
      />

      <div v-else>
        <div
          v-for="data in wordRegistryState && wordRegistryState"
          :key="data.word"
        >
          <WordListing
            :data="data"
            :show-buy-value="showBuyValue"
          />
        </div>
      </div>
    </template>

    <CreateToken
      v-if="activity === 'create'"
      :navigate-assets="() => activity = 'assets'"
    />
    <GetAe v-if="activity === 'getae'" />
    <HowItWorks v-if="activity === 'how'" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loader from '../components/Loader.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import ActivityRibbon from '../components/ActivityRibbon.vue';
import TabBar from '../components/TabBar.vue';
import CreateToken from '../components/CreateToken.vue';
import GetAe from '../components/GetAe.vue';
import HowItWorks from '../components/HowItWorks.vue';
import SearchInput from '../components/layout/SearchInput.vue';
import IconHelp2 from '../assets/iconHelp2.svg?icon-component';
import IconTokens from '../assets/iconTokens.svg?icon-component';
import IconPlus from '../assets/iconPlus.svg?icon-component';
import IconAe from '../assets/iconAe.svg?icon-component';
import IconSearch from '../assets/iconSearch.svg?icon-component';
import IconFilter from '../assets/iconFilter.svg?icon-component';
import BubbleArrow from '../assets/bubbleArrow.svg?icon-component';
import { EventBus } from '../utils/eventBus';

export default {
  name: 'WordBazaar',
  components: {
    WordListing,
    Loader,
    BackButtonRibbon,
    ActivityRibbon,
    TabBar,
    CreateToken,
    GetAe,
    HowItWorks,
    IconSearch,
    IconFilter,
    SearchInput,
    BubbleArrow,
  },
  data() {
    return {
      wordRegistryState: null,
      activity: 'assets',
      activeTab: 'all',
      ordering: 'buyprice',
      direction: 'desc',
      search: '',
      showSearch: false,
      showBuyValue: true,
      loading: true,
    };
  },
  computed: {
    ...mapState(['address']),
    ribbonTabs() {
      const icons = [IconTokens, IconPlus, IconAe, IconHelp2];
      return this.$t('views.WordBazaar.RibbonTabs')
        .map((t, i) => ({ ...t, icon: icons[i] }));
    },
    ribbonTabsMobile() {
      return this.ribbonTabs.map((t, i) => ({
        ...t,
        text: this.$t(`views.WordBazaar.RibbonTabs[${i}].textMobile`),
      }));
    },
    tabs() {
      return this.$t('views.WordBazaar.Tabs');
    },
    tabsMobile() {
      return this.tabs.map((t) => ({ ...t, text: t.textMobile, icon: IconFilter }));
    },
  },
  mounted() {
    this.reloadData();
  },
  created() {
    this.loading = true;
    this.reloadData();
    this.loading = false;
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    setInterval(() => this.reloadData(), 120 * 1000);
  },
  methods: {
    async order(ordering, direction) {
      this.ordering = ordering;
      this.direction = direction;
      await this.reloadData();
    },
    async reloadData() {
      this.wordRegistryState = await Backend
        .getWordRegistry(this.ordering, this.direction, this.search);
    },
    async closeSearch() {
      this.showSearch = false;
      this.search = '';
      await this.reloadData();
    },
  },
  metaInfo() {
    return { title: this.$t('views.WordBazaar.Title') };
  },
};
</script>

<style lang="scss" scoped>
.word-bazaar {
  width: 624px;
  background: $actions_ribbon_background_color;

  ::v-deep .actions-ribbon {
    height: 56px;
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;

    .activity {
      white-space: nowrap;
      font-size: 17px;
      line-height: 22px;
      margin-right: 4px;
    }

    .activity-bubble {
      position: relative;
    }

    .bubbleArrow {
      height: 40px;
      width: auto;
      color: $secondary_color;
    }

    .activity-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      height: 24px;
      width: 24px;
      color: $secondary_color;
    }
  }

  ::v-deep .tab-bar {
    height: 40px;
    background-color: $buttons_background;
    position: sticky;
    top: 121px;
    z-index: 1;

    &.mobile {
      display: none;
    }

    button {
      @include desktop {
        font-size: 15px;
        transition: border-color 0s;
        border: none;
        margin-right: 18px;

        svg {
          height: 16px;
          width: auto;
          margin-bottom: 3px;
          margin-left: 4px;
        }
      }
    }

    .active {
      @include desktop {
        border: none;
      }
    }

    @include desktop {
      padding: 0 16px;

      &.mobile {
        display: flex;
        top: 120px;
      }
      &.desktop { display: none; }
    }
  }

  ::v-deep .activity-ribbon {
    box-sizing: border-box;
    background-color: $buttons_background;
    height: 65px;
    border-bottom: 1px solid $actions_ribbon_background_color;
    position: sticky;
    margin: 0;
    top: 56px;
    z-index: 1;

    &.mobile {
      display: none;
    }

    .filter-button {
      height: 40px;
      border-radius: 20px;
      font-size: 16px;

      svg {
        height: 24px;
        width: auto;
        margin-bottom: 2px;
        flex-shrink: 0;
      }

      @include desktop {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 15px;
        font-weight: 500;
        height: 56px;
        margin: 0;

        &.active,
        &:hover {
          background-color: transparent;
        }
      }
    }

    @include desktop {
      &.mobile { display: flex; }
      &.desktop { display: none; }
    }

    @include mobile {
      height: 72px;
      background:
        linear-gradient(
          180deg,
          $actions_ribbon_background_color 0%,
          $background_color 100%
        );
      border-radius: 0 0 10px 10px;
      top: 48px;
    }
  }

  ::v-deep .search-input {
    height: 38px;
    width: 100%;
    color: $standard_font_color;

    input {
      padding: 0 16px;
      color: $secondary_color;

      &::placeholder {
        color: $standard_font_color;
        opacity: 1;
      }
    }

    .iconClose {
      height: 24px;
      width: auto;
    }

    @include desktop {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
  }

  .iconSearch {
    height: 24px;
    width: auto;
    margin-right: 8px;
    cursor: pointer;
    transition: color 0.3s ease-in-out, opacity 0.3s ease-in-out;
    opacity: 0.7;

    &:hover {
      color: $custom_links_color;
      opacity: 1;
    }

    @include desktop {
      margin-right: 0;
    }
  }

  @include mobile {
    width: 360px;
  }
}

a {
  margin-right: 0.5rem;
  text-decoration: underline !important;
}

h2 {
  margin-top: 1rem;
}
</style>
