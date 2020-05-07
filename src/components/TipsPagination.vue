<template>
  <div>
    <Loading
      v-if="loadingTips"
      class="m-2 loading-position"
    />
    <div v-if="tips">
      <TipRecord
        v-for="tip in tips"
        :key="tip.id"
        :ref="`tip-id-${tip.id}`"
        :tip="tip"
        :fiat-value="tip.fiatValue"
        :sender-link="openExplorer(tip.sender)"
      />
      <Loading
        v-if="loadingMoreTips"
        class="m-2"
      />
      <div
        v-if="tips.length === 0"
        class="no-results text-center m-2"
      >
        {{ $t('components.TipsPagination.NoResultsMsg') }}
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es';
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
      lastTipId: -1,
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
  activated() {
    this.scroll();
  },
  methods: {
    async startFromTop() {
      window.scrollTo(0, 0);
      this.endReached = false;
      this.page = 1;
      this.loadData();
    },
    async loadData() {
      this.loadingTips = true;
      this.tips = await Backend.getCacheTips(this.tipSortBy, this.page, this.address, this.search);
      this.lastTipId = get(this.tips[this.tips.length - 1], 'id');
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
          this.lastTipId = tips[tips.length - 1].id;
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
      this.lastTipId = get(this.tips[this.tips.length - 1], 'id');
      this.loadingTips = false;
    },
    openExplorer(address) {
      return `${MIDDLEWARE_URL}account/transactions/${address}`;
    },
    scroll() {
      window.onscroll = () => {
        const isLastTipInViewport = this.lastTipId !== -1
          && this.$refs[`tip-id-${this.lastTipId}`]
          && this.$refs[`tip-id-${this.lastTipId}`][0].$el
            .getBoundingClientRect()
            .bottom <= (window.innerHeight || document.documentElement.clientHeight);

        if (isLastTipInViewport) {
          this.lastTipId = -1;
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
