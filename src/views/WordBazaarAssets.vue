<template>
  <div class="word-bazaar-assets">
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
    return { title: this.$t('views.WordBazaar.RibbonTabs.0.Text') };
  },
};
</script>

<style lang="scss" scoped>
.word-bazaar {
  .tab-bar {
    background-color: $buttons_background;
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
</style>
