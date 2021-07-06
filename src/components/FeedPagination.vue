<template>
  <div class="feed-pagination">
    <Loader
      v-if="tipsReloading"
      lg
    />
    <template v-if="tips">
      <TipRecord
        v-for="tip in tips"
        :key="tip.id"
        :tip="tip"
        :fiat-value="tip.fiatValue"
      />
      <Loader
        v-if="tipsNextPageLoading"
        lg
      />
      <div
        v-if="tips.length === 0"
        class="no-results"
      >
        {{ $t('components.TipsPagination.NoResultsMsg') }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loader from './Loader.vue';
import TipRecord from './tipRecords/TipRecord.vue';
import { EventBus } from '../utils/eventBus';

const namesToHandlers = (names, getHandler) => names
  .reduce((acc, name) => ({ ...acc, [name]: getHandler(name) }), {});

export default {
  components: {
    TipRecord,
    Loader,
  },
  props: {
    tipSortBy: { type: String, required: true },
    address: { type: String, default: null },
    search: { type: String, default: null },
    blacklist: Boolean,
    showTips: Boolean,
    showPosts: Boolean,
  },
  computed: {
    args() {
      return [this.tipSortBy,
        this.address, this.search,
        this.blacklist,
        this.showTips,
        this.showPosts];
    },
    ...mapState(
      'backend',
      namesToHandlers(
        ['tips', 'tipsReloading', 'tipsNextPageLoading'],
        (name) => function getState(state) { return state[name][this.args]; },
      ),
    ),
  },
  async mounted() {
    await this.reloadTips();

    const scrollHandler = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        this.loadNextPageOfTips();
      }
    };
    window.addEventListener('scroll', scrollHandler);

    const reloadTips = () => this.reloadTips();
    EventBus.$on('reloadData', reloadTips);

    const interval = setInterval(reloadTips, 120 * 1000);

    this.$once('hook:destroyed', () => {
      window.removeEventListener('scroll', scrollHandler);
      EventBus.$off('reloadData', reloadTips);
      clearInterval(interval);
    });

    this.$watch(
      ({ args }) => args,
      async () => {
        window.scrollTo(0, 0);
        await this.reloadTips();
      },
    );
  },
  methods: namesToHandlers(
    ['reloadTips', 'loadNextPageOfTips'],
    (name) => async function callAction() {
      await this.$store.dispatch(`backend/${name}`, this.args);
    },
  ),
};
</script>

<style lang="scss" scoped>
.feed-pagination .no-results {
  text-align: center;
  margin: 0.5rem;
}
</style>
