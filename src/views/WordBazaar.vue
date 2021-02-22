<template>
  <div class="word-bazaar">
    <BackButtonRibbon hide-back>
      <template v-slot:title>
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
      :tabs="ribbonTabs"
    />

    <template v-if="activity === 'assets'">
      <TabBar
        v-model="activeTab"
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
      ribbonTabs: [
        { icon: IconTokens, activity: 'assets' },
        { icon: IconPlus, activity: 'create' },
        { icon: IconAe, activity: 'getae' },
        { icon: IconHelp2, activity: 'how' },
      ].map((t, i) => ({
        text: this.$t(`views.WordBazaar.RibbonTabs[${i}].Text`),
        header: this.$t(`views.WordBazaar.RibbonTabs[${i}].Text`),
        ...t,
      })),
      tabs: [
        { text: 'All tokens', tab: 'all' },
        { text: 'Trending', tab: 'trending' },
        { text: 'Recent', tab: 'recent' },
      ],
      showSearch: false,
      showBuyValue: true,
      loading: true,
    };
  },
  computed: {
    ...mapState(['address']),
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

  .tab-bar {
    height: 40px;
    background-color: $buttons_background;
  }

  .activity-ribbon {
    background-color: $buttons_background;
    height: 64px;
    margin-bottom: 1px;

    ::v-deep .filter-button {
      height: 40px;
      border-radius: 20px;
      font-size: 16px;

      svg {
        height: 24px;
        width: auto;
        margin-bottom: 2px;
      }
    }
  }

  ::v-deep .search-input {
    height: 38px;
    width: 100%;
    color: $standard_font_color;

    &.mobile {
      margin: 4px;

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
  }

  .iconSearch {
    height: 24px;
    width: auto;
    margin-right: 5px;
    cursor: pointer;
    transition: color 0.3s ease-in-out, opacity 0.3s ease-in-out;
    opacity: 0.7;

    &:hover {
      color: $custom_links_color;
      opacity: 1;
    }
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
