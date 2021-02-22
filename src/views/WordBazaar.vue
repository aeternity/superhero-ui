<template>
  <div class="word-bazaar">
    <BackButtonRibbon hide-back>
      <template v-slot:title>
        <span>{{ ribbonTabs.find((a) => a.activity === activity).header }}</span>
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
          :placeholder="$t('views.WordBazaar.Placeholder')"
          class="desktop"
          @input="reloadData"
          @close="showSearch = false"
        />
        <IconSearch
          v-else
          @click="showSearch = true"
        />
      </TabBar>
      <SearchInput
        v-if="showSearch"
        v-model="search"
        :placeholder="$t('views.WordBazaar.Placeholder')"
        class="mobile"
        @input="reloadData"
        @close="showSearch = false"
      />

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
    this.reloadData();
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
      this.loading = true;
      this.wordRegistryState = await Backend
        .getWordRegistry(this.ordering, this.direction, this.search);
      this.loading = false;
    },
  },
  metaInfo() {
    return { title: this.$t('views.WordBazaar.Title') };
  },
};
</script>

<style lang="scss" scoped>
.word-bazaar {
  .actions-ribbon {
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;
  }

  .activity-ribbon,
  .tab-bar {
    background-color: $buttons_background;
  }

  .activity-ribbon {
    margin-bottom: 1px;

    ::v-deep svg {
      height: 24px;
      width: auto;
    }
  }

  ::v-deep .search-input {
    border-radius: 0.5rem;

    &.mobile {
      margin: 4px;

      @include desktop-only {
        display: none;
      }
    }

    &.desktop {
      @include desktop {
        display: none;
      }
    }

    input {
      padding: 0 0.5rem;
    }

    svg {
      height: 0.75rem;
      width: auto;
    }
  }

  .iconSearch {
    height: 18px;
    width: 18px;
    margin-right: 20px;
    cursor: pointer;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: $custom_links_color;
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

::v-deep .abbreviation {
  font-weight: 500;
  color: $secondary_color;
}
</style>
