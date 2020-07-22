<template>
  <div>
    <Loading
      v-if="tipsReloading"
      above-content
    />
    <div v-if="tips">
      <TipRecord
        v-for="tip in tips"
        :key="tip.id"
        :tip="tip"
        :fiat-value="tip.fiatValue"
      />
      <Loading v-if="tipsNextPageLoading" />
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
import { mapState } from 'vuex';
import Loading from './Loading.vue';
import TipRecord from './tipRecords/TipRecord.vue';
import { EventBus } from '../utils/eventBus';

const namesToHandlers = (names, getHandler) => names
  .reduce((acc, name) => ({ ...acc, [name]: getHandler(name) }), {});

export default {
  name: 'TipsPagination',
  components: {
    TipRecord,
    Loading,
  },
  props: {
    tipSortBy: { type: String, required: true },
    address: { type: String, default: null },
    search: { type: String, default: null },
    blacklist: Boolean,
  },
  computed: {
    args() {
      return [this.tipSortBy, this.address, this.search, this.blacklist];
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
