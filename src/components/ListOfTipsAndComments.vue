<template>
  <div class="list-of-tips-and-comments">
    <ActivityRibbon>
      <FilterButton :to="genLocation({ activity: 'channel' })">
        <IconChannel />
        {{ ' ' }}<span>{{ $t('components.ListOfTipsAndComments.Channel') }}</span>
      </FilterButton>
      <FilterButton
        :to="genLocation({ activity: 'feed' })"
        :class="{ active: ['feed', 'comments'].includes(activity) }"
      >
        <IconActivity />
        {{ ' ' }}<span>{{ $t('components.ListOfTipsAndComments.Activity') }}</span>
      </FilterButton>
    </ActivityRibbon>

    <TabBar v-if="['feed', 'comments'].includes(activity)">
      <TabBarButton :to="genLocation({ activity: 'feed' })">
        {{ $t('tips') }}
      </TabBarButton>
      <TabBarButton :to="genLocation({ activity: 'comments' })">
        {{ $t('comments') }}
      </TabBarButton>
    </TabBar>

    <FeedPagination
      v-if="activity === 'feed'"
      tip-sort-by="latest"
      :address="address"
      show-tips
      show-posts
    />
    <template v-else>
      <div
        v-if="error"
        class="message"
      >
        Unknown error
      </div>
      <Loader v-if="loading" />
      <div
        v-else-if="!items.length"
        class="message"
      >
        {{ activity === 'channel' && $t('components.ListOfTipsAndComments.NoPinnedItems')
          || $t('components.ListOfTipsAndComments.NoActivity') }}
      </div>
      <TipCommentList
        v-if="activity === 'comments'"
        :comments="items"
      />
      <TipRecord
        v-for="pinnedItem in items"
        v-else-if="activity === 'channel'"
        :key="pinnedItem.id"
        :tip="pinnedItem"
      />
    </template>
  </div>
</template>

<script>
import { pickBy } from 'lodash-es';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import Loader from './Loader.vue';
import FeedPagination from './FeedPagination.vue';
import TipCommentList from './tipRecords/TipCommentList.vue';
import TipRecord from './tipRecords/TipRecord.vue';
import IconChannel from '../assets/iconChannel.svg?icon-component';
import IconActivity from '../assets/iconActivity.svg?icon-component';
import ActivityRibbon from './ActivityRibbon.vue';
import FilterButton from './FilterButton.vue';
import TabBar from './TabBar.vue';
import TabBarButton from './TabBarButton.vue';

export default {
  components: {
    TabBar,
    TabBarButton,
    FeedPagination,
    Loader,
    TipCommentList,
    TipRecord,
    ActivityRibbon,
    FilterButton,
    IconChannel,
    IconActivity,
  },
  props: { address: { type: String, required: true } },
  data: () => ({
    loading: false,
    error: false,
    pinnedItems: [],
  }),
  computed: {
    activity() {
      return this.$route.params.activity || 'feed';
    },
    items() {
      switch (this.activity) {
        case 'comments':
          return this.$store.state.backend.userComments[this.address] || [];
        case 'channel':
          return this.pinnedItems;
        default:
          return [];
      }
    },
  },
  mounted() {
    this.$watch(
      ({ address, activity }) => [address, activity],
      () => this.reloadData(),
      { immediate: true },
    );
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });
    const interval = setInterval(() => this.reloadData(), 120 * 1000);
    this.$once('hook:beforeDestroy', () => clearInterval(interval));
  },
  methods: {
    genLocation(addToParams) {
      return {
        ...this.$route,
        params: pickBy({ ...this.$route.params, ...addToParams }, (p) => p !== 'feed'),
      };
    },
    async reloadData() {
      this.loading = true;
      try {
        this.error = false;
        switch (this.activity) {
          case 'feed':
            break;
          case 'channel':
            this.pinnedItems = await Backend.getPinnedItems(this.address);
            break;
          case 'comments':
            await this.$store.dispatch('backend/reloadUserComments', this.address);
            break;
          default:
            throw new Error(`Unknown activity: ${this.activity}`);
        }
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-of-tips-and-comments .message {
  text-align: center;
  margin: 1rem 0;
}
</style>
