<template>
  <div>
    <ActivityRibbon
      :tabs="ribbonTabs"
      :activity="activity"
      :set="(setActivity) => activity = setActivity"
    />

    <TabBar
      v-if="activity === 'activity'"
      :tabs="tabs"
      :active-tab="activeTab"
      :set="(setTab) => activeTab = setTab"
    />

    <div class="position-relative">
      <div
        v-if="activeTab === 'tips' && activity === 'activity'"
        class="tips__container"
      >
        <TipsPagination
          tip-sort-by="latest"
          :address="address"
        />
      </div>
      <div
        v-if="activeTab === 'comments' && activity === 'activity'"
        class="tips__container"
      >
        <Loading
          v-if="showLoading"
          above-content
        />
        <div
          v-if="showNoResultsMsg"
          class="no-results"
          :class="{ error }"
        >
          {{ $t('components.ListOfTipsAndComments.NoActivity') }}
        </div>
        <TipComment
          v-for="(comment, index) in comments"
          :key="index"
          v-bind="comment"
        />
      </div>
      <div
        v-if="activeTab === 'tips' && activity === 'channel'"
        class="tips__container"
      >
        <div
          v-if="!pinnedItems.length"
          class="no-results"
          :class="{ error }"
        >
          {{ $t('components.ListOfTipsAndComments.NoPinnedItems') }}
        </div>
        <TipRecord
          v-for="pinnedItem in pinnedItems"
          :key="pinnedItem.id"
          :tip="pinnedItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import Loading from './Loading.vue';
import TipsPagination from './TipsPagination.vue';
import TipComment from './tipRecords/TipComment.vue';
import TipRecord from './tipRecords/TipRecord.vue';
import IconChannel from '../assets/iconChannel.svg?icon-component';
import IconActivity from '../assets/iconActivity.svg?icon-component';
import ActivityRibbon from './ActivityRibbon.vue';
import TabBar from './TabBar.vue';

export default {
  components: {
    TabBar,
    TipsPagination,
    Loading,
    TipComment,
    TipRecord,
    ActivityRibbon,
  },
  props: { address: { type: String, required: true } },
  data: () => ({
    showLoading: false,
    error: false,
    activeTab: 'tips',
    activity: 'activity',
    userPinnedItems: [],
  }),
  computed: {
    ...mapState({ currentAddress: 'address' }),
    pinnedItems() {
      return this.address === this.currentAddress
        ? this.$store.state.pinnedItems : this.userPinnedItems;
    },
    showNoResultsMsg() {
      return this.activeTab === 'comments'
        && this.comments.length === 0 && !this.showLoading;
    },
    comments() {
      return this.$store.state.backend.userComments[this.address] || [];
    },
    ribbonTabs() {
      return [{ icon: IconChannel, text: this.$t('components.ListOfTipsAndComments.Channel'), activity: 'channel' }, { icon: IconActivity, text: this.$t('components.ListOfTipsAndComments.Activity'), activity: 'activity' }];
    },
    tabs() {
      return [{ text: this.$t('tips'), tab: 'tips' }, { text: this.$t('comments'), tab: 'comments' }];
    },
  },
  mounted() {
    this.reloadData();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    if (this.address !== this.currentAddress) {
      Backend.getPinnedItems(this.address)
        .then((pinnedItems) => {
          this.userPinnedItems = pinnedItems;
        })
        .catch(console.error);
    }

    const interval = setInterval(() => this.reloadData(), 120 * 1000);
    this.$once('hook:beforeDestroy', () => clearInterval(interval));
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async reloadData() {
      this.showLoading = true;
      try {
        await this.$store.dispatch('backend/reloadUserComments', this.address);
        this.error = false;
      } catch (error) {
        this.error = true;
        throw error;
      } finally {
        this.showLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.profile__actions {
  background-color: $actions_ribbon_background_color;
  padding-left: 1rem;
  position: sticky;
  top: 3rem;
  z-index: 21;

  a {
    color: $light_font_color;
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    margin-right: 0.5rem;
    padding: 0.5rem;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }

    &.active {
      border-bottom: 2px solid $custom_links_color;
      color: $custom_links_color;
    }
  }

  .activity-ribbon {
    background-color: $light_color;
    padding: 0.5rem 0 0.5rem 0.75rem;
    margin-left: -1rem;
  }
}

.no-results {
  text-align: center;
  margin-top: 1rem;
}
</style>
