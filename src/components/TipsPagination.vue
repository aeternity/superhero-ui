<template>
  <div>
    <Loading
      v-if="loadingTips"
      class="m-2 loading-position-absolute"
    />
    <div v-if="tips">
      <TipRecord
        v-for="tip in tips"
        :key="tip.id"
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
import { times } from 'lodash-es';
import Loading from './Loading.vue';
import Backend from '../utils/backend';
import { MIDDLEWARE_URL } from '../config/constants';
import TipRecord from './tipRecords/TipRecord.vue';
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
    blacklist: { type: Boolean, required: false },
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
    blacklist() {
      this.startFromTop();
    },
  },
  async created() {
    await this.reloadData();
  },
  mounted() {
    const scrollHandler = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        this.loadMoreTips();
      }
    };
    window.addEventListener('scroll', scrollHandler);
    this.$on('hook:activated', () => window.addEventListener('scroll', scrollHandler));
    this.$on('hook:deactivated', () => window.removeEventListener('scroll', scrollHandler));
    this.$once('hook:destroyed', () => window.removeEventListener('scroll', scrollHandler));

    EventBus.$on('reloadData', () => this.reloadData());

    const interval = setInterval(() => this.reloadData(), 120 * 1000);
    this.$once('hook:destroyed', () => clearInterval(interval));
  },
  methods: {
    async startFromTop() {
      window.scrollTo(0, 0);
      this.endReached = false;
      this.page = 1;
      this.tips = null;
      await this.reloadData();
    },
    getCacheTips(page) {
      return Backend.getCacheTips(this.tipSortBy, page, this.address, this.search, this.blacklist);
    },
    async loadMoreTips() {
      if (!this.endReached && !this.loadingMoreTips) {
        this.loadingMoreTips = true;
        const tips = await this.getCacheTips(this.page + 1);
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
      this.tips = (await Promise.all(
        times(this.page, (page) => this.getCacheTips(page + 1)),
      )).flat();
      this.loadingTips = false;
    },
    openExplorer(address) {
      return `${MIDDLEWARE_URL}account/transactions/${address}`;
    },
  },
};
</script>
