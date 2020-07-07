<template>
  <div>
    <div class="profile__actions">
      <div
        class="activity-ribbon"
      >
        <FilterButton
          :class="{ active: activity === 'channel' }"
          @click="activity = 'channel'; activeTab = 'tips'"
        >
          <IconChannel />
          <span class="vertical-align-mid">
            {{ $t('components.ListOfTipsAndComments.Channel') }}
          </span>
        </FilterButton>
        <FilterButton
          :class="{ active: activity === 'activity' }"
          @click="activity = 'activity'"
        >
          <IconActivity />
          <span class="vertical-align-mid">
            {{ $t('components.ListOfTipsAndComments.Activity') }}
          </span>
        </FilterButton>
      </div>
      <a
        :class="{ active: activeTab === 'tips' }"
        @click="setActiveTab('tips')"
      >
        {{ $t('tips') }}
      </a>
      <a
        v-if="activity === 'activity'"
        :class="{ active: activeTab === 'comments' }"
        @click="setActiveTab('comments')"
      >
        {{ $t('comments') }}
      </a>
    </div>
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
          class="loading-position-absolute"
        />
        <div
          v-if="showNoResultsMsg"
          class="no-results"
          :class="[error ? 'error' : '']"
        >
          {{ $t('components.ListOfTipsAndComments.NoActivity') }}
        </div>
        <TipComment
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
          :sender-link="openExplorer(comment.author)"
        />
      </div>
      <div
        v-if="activeTab === 'tips' && activity === 'channel'"
        class="tips__container"
      >
        <div v-if="address === account">
          <div
            v-if="!pinnedItems.length"
            class="no-results"
            :class="[error ? 'error' : '']"
          >
            {{ $t('components.ListOfTipsAndComments.NoPinnedItems') }}
          </div>
          <TipRecord
            v-for="pinnedItem in pinnedItems"
            :key="pinnedItem.id"
            :tip="pinnedItem"
          />
        </div>
        <div v-else>
          <div
            v-if="!userPinnedItems.length"
            class="no-results"
            :class="[error ? 'error' : '']"
          >
            {{ $t('components.ListOfTipsAndComments.NoPinnedItems') }}
          </div>
          <TipRecord
            v-for="userPinnedItem in userPinnedItems"
            :key="userPinnedItem.id"
            :tip="userPinnedItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Backend from '../utils/backend';
import { EventBus } from '../utils/eventBus';
import { EXPLORER_URL } from '../config/constants';
import Loading from './Loading.vue';
import TipsPagination from './TipsPagination.vue';
import TipComment from './tipRecords/TipComment.vue';
import TipRecord from './tipRecords/TipRecord.vue';
import IconChannel from '../assets/iconChannel.svg?icon-component';
import IconActivity from '../assets/iconActivity.svg?icon-component';
import FilterButton from './FilterButton.vue';

export default {
  components: {
    TipsPagination,
    Loading,
    TipComment,
    TipRecord,
    IconChannel,
    IconActivity,
    FilterButton,
  },
  props: { address: { type: String, required: true } },
  data: () => ({
    explorerUrl: `${EXPLORER_URL}account/transactions/`,
    showLoading: false,
    error: false,
    comments: [],
    activeTab: 'tips',
    activity: 'activity',
    userPinnedItems: [],
  }),
  computed: {
    ...mapState(['loading', 'pinnedItems', 'account']),
    showNoResultsMsg() {
      return this.activeTab === 'comments'
        && this.comments.length === 0 && !this.showLoading && !this.loading.tips;
    },
  },
  mounted() {
    this.reloadData();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    if (this.address !== this.account) {
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
    openExplorer(address) {
      return this.explorerUrl + address;
    },
    reloadData() {
      this.showLoading = true;
      Backend.getAllComments()
        .then((allComments) => {
          this.showLoading = false;
          this.error = false;
          this.comments = allComments.filter(
            (comment) => comment.author === this.address,
          );
        })
        .catch((e) => {
          console.error(e);
          this.error = true;
          this.showLoading = false;
        });
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
    padding: 0.5rem 0;
    margin-left: -1rem;
    padding-left: 0.75rem;
  }
}

.no-results {
  text-align: center;
  margin-top: 1rem;
}
</style>
