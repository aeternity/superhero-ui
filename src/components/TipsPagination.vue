<template>
  <div>
    <loading
      :show-loading="loadingTips"
      class="m-2 loading-position"
    />
    <div v-if="tips">
      <TipRecord
        v-for="tip in tips"
        :key="tip.id"
        :tip="tip"
        :fiat-value="tip.fiatValue"
        :sender-link="openExplorer(tip.sender)"
      />
      <loading
        v-if="loadingMoreTips"
        :show-loading="loadingMoreTips"
        class="m-2"
      />
      <div
        v-if="tips.length === 0"
        class="no-results text-center m-2"
      >
        {{ $t('pages.Home.NoResultsMsg') }}
      </div>
    </div>
  </div>
</template>

<script>
import Loading from './Loading.vue';
import Backend from '../utils/backend';
import { MIDDLEWARE_URL } from '../config/constants';
import TipRecord from './tipRecords/TipRecord.vue';
import Util from '../utils/util';
import { EventBus } from '../utils/eventBus';

export default {
  name: 'TipsPagination',
  components: {
    TipRecord,
    Loading,
  },
  props: {
    tipSortBy: { type: String, required: true },
    address: { type: String, required: false, default: null },
    search: { type: String, required: false, default: null },
  },
  data() {
    return {
      loadingMoreTips: false,
      loadingTips: false,
      endReached: false,
      page: 1,
      tips: null,
    };
  },
  watch: {
    tipSortBy() {
      this.startFromTop();
    },
    search() {
      this.startFromTop();
    },
  },
  async created() {
    this.loadData();
  },
  mounted() {
    this.scroll();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async startFromTop() {
      window.scrollTo(0, 0);
      this.endReached = false;
      this.page = 1;
      this.tips = null;
      this.loadData();
    },
    async loadData() {
      this.loadingTips = true;
      this.tips = await Backend.getCacheTips(this.tipSortBy, this.page, this.address, this.search);
      this.loadingTips = false;
    },
    async loadMoreTips() {
      if (!this.endReached) {
        this.loadingMoreTips = true;
        const tips = await Backend
          .getCacheTips(this.tipSortBy, this.page + 1, this.address, this.search);
        this.tips = this.tips.concat(tips);
        if (tips.length > 0) {
          this.page += 1;
        } else {
          this.endReached = true;
        }
        this.loadingMoreTips = false;
      }
    },
    async reloadData() {
      this.loadingTips = true;

      this.tips = await Util.range(1, this.page)
        .asyncMap(async (page) => Backend
          .getCacheTips(this.tipSortBy, page, this.address, this.search));
      this.loadingTips = false;
    },
    openExplorer(address) {
      return `${MIDDLEWARE_URL}account/transactions/${address}`;
    },
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow = document.documentElement.scrollTop
            + window.innerHeight === document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          this.loadMoreTips();
        }
      };
    },
  },
};
</script>


<style lang="scss" scoped>
  .loading-position {
    position: absolute;
  }
</style>
