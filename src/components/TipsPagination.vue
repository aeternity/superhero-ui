<template>
  <div>
    <loading :show-loading="loadingTips" class="m-2 loading-position"/>
    <div v-if="tips">
      <TipRecord
        v-for="(tip,index) in tips"
        :key="index"
        :tip="tip"
        :fiatValue="tip.fiatValue"
        :senderLink="openExplorer(tip.sender)"
      />
      <loading :show-loading="loadingMoreTips" v-if="loadingMoreTips" class="m-2"/>
      <div class="no-results text-center m-2" v-if="tips.length === 0">
        {{$t('pages.Home.NoResultsMsg')}}
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from './Loading.vue';
  import Backend from '../utils/backend';
  import { MIDDLEWARE_URL } from '../config/constants';
  import TipRecord from './tipRecords/TipRecord';
  import Util from '../utils/util';
  import { EventBus } from '../utils/eventBus';

  export default {
    name: 'TipsPagination',
    props: ['tipSortBy', 'address', 'search'],
    data() {
      return {
        loadingMoreTips: false,
        loadingTips: false,
        page: 1,
        tips: null,
      };
    },
    components: {
      TipRecord,
      Loading,
    },
    watch : {
      tipSortBy: function() {
        window.scrollTo(0, 0);
        this.page = 1;
        this.loadData();
      }
    },
    methods: {
      async loadData() {
        this.loadingTips = true;
        this.tips = await Backend.getCacheTips(this.tipSortBy, this.page, this.address);
        this.loadingTips = false;
      },
      async loadMoreTips() {
        this.loadingMoreTips = true;
        const tips = await Backend.getCacheTips(this.tipSortBy, this.page + 1, this.address);
        this.tips = this.tips.concat(tips);
        if (tips.length > 0) this.page += 1;
        this.loadingMoreTips = false;
      },
      async reloadData() {
        this.loadingTips = true;

        this.tips = await Util.range(1, this.page)
          .asyncMap(async (page) => Backend.getCacheTips(this.tipSortBy, page, this.address));
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
  };
</script>


<style lang="scss" scoped>
  .loading-position {
    position: absolute;
  }
</style>
