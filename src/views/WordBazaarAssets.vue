<template>
  <div class="word-bazaar-assets">
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import WordListing from '../components/WordListing.vue';
import Loader from '../components/Loader.vue';
import TabBar from '../components/TabBar.vue';
import SearchInput from '../components/layout/SearchInput.vue';
import IconSearch from '../assets/iconSearch.svg?icon-component';
import IconFilter from '../assets/iconFilter.svg?icon-component';
import { EventBus } from '../utils/eventBus';

export default {
  components: {
    WordListing,
    Loader,
    TabBar,
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
      showSearch: false,
      showBuyValue: true,
      loading: true,
    };
  },
  computed: {
    ...mapState(['address']),
    tabs() {
      return this.$t('views.WordBazaar.Tabs');
    },
    tabsMobile() {
      return this.tabs.map((t) => ({ ...t, text: t.textMobile, icon: IconFilter }));
    },
  },
  mounted() {
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
    async closeSearch() {
      this.showSearch = false;
      this.search = '';
      await this.reloadData();
    },
  },
  metaInfo() {
    return { title: this.$t('views.WordBazaar.RibbonTabs.0.Text') };
  },
};
</script>

<style lang="scss" scoped>
.word-bazaar-assets {
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
    margin-right: 8px;
    cursor: pointer;
    transition: 0.3s;
    transition-property: color, opacity;
    opacity: 0.7;

    &:hover {
      color: $custom_links_color;
      opacity: 1;
    }

    @include desktop {
      margin-right: 0;
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
