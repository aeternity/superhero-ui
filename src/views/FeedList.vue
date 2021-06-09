<template>
  <div class="tips-list">
    <div class="actions">
      <SendTip :post="feed !== 'tips'" />
      <div class="feed-category-row">
        <FilterButton
          :class="{ active: feed === 'main' }"
          @click="feed = 'main'"
        >
          <IconFeed />
          <span>
            {{ $t('views.FeedList.main') }}
          </span>
        </FilterButton>
        <FilterButton
          :class="{ active: feed === 'tips' }"
          @click="feed = 'tips'"
        >
          <IconDiamond />
          <span>
            {{ $t('views.FeedList.tips') }}
          </span>
        </FilterButton>
        <FilterButton
          :class="{ active: feed === 'posts' }"
          @click="feed = 'posts'"
        >
          <IconPosts />
          <span>
            {{ $t('views.FeedList.posts') }}
          </span>
        </FilterButton>
      </div>
      <div class="not-bootstrap-row">
        <ButtonPlain
          id="sort-latest"
          :class="{ active: tipSortBy === 'latest' }"
          @click="setTipSortBy('latest')"
        >
          {{ $t('views.TipList.SortingLatest') }}
        </ButtonPlain>
        <ButtonPlain
          :class="{ active: tipSortBy === 'hot' }"
          @click="setTipSortBy('hot')"
        >
          {{ $t('views.TipList.SortingMostPopular') }}
        </ButtonPlain>
        <ButtonPlain
          :class="{ active: tipSortBy === 'highest' }"
          @click="setTipSortBy('highest')"
        >
          {{ $t('views.TipList.SortingHighestRated') }}
        </ButtonPlain>
        <div class="separator" />
        <ThreeDotsMenu>
          <Checkbox
            :checked="isHiddenContent"
            @change="setIsHiddenContent(!isHiddenContent)"
          >
            {{ $t('views.TipList.SafeContentOnly') }}
          </Checkbox>
        </ThreeDotsMenu>
      </div>
    </div>

    <FeedPagination
      :tip-sort-by="tipSortBy"
      :search="query"
      :blacklist="isHiddenContent"
      :show-tips="['main', 'tips'].includes(feed)"
      :show-posts="['main', 'posts'].includes(feed)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SendTip from '../components/layout/sendTip/SendTip.vue';
import FeedPagination from '../components/FeedPagination.vue';
import ThreeDotsMenu from '../components/ThreeDotsMenu.vue';
import Checkbox from '../components/Checkbox.vue';
import ButtonPlain from '../components/ButtonPlain.vue';
import FilterButton from '../components/FilterButton.vue';
import IconFeed from '../assets/iconFeed.svg?icon-component';
import IconDiamond from '../assets/iconDiamond.svg?icon-component';
import IconPosts from '../assets/iconPosts.svg?icon-component';

export default {
  components: {
    FeedPagination,
    SendTip,
    Checkbox,
    ThreeDotsMenu,
    ButtonPlain,
    FilterButton,
    IconFeed,
    IconDiamond,
    IconPosts,
  },
  props: {
    query: { type: String, default: '' },
  },
  data: () => ({ feed: 'main' }),
  computed: mapState(['tipSortBy', 'isHiddenContent']),
  methods: mapMutations(['setTipSortBy', 'setIsHiddenContent']),
  metaInfo: {
    title: 'Tips',
  },
};
</script>

<style lang="scss" scoped>
.tips-list .actions {
  position: sticky;
  top: 0;
  z-index: 100;
  font-size: 0.75rem;
  background-color: $background_color;
  color: $light_font_color;

  @include mobile {
    top: $mobile_navigation_height;
  }

  .send-tip {
    margin: 0.15rem 0;

    @include smallest {
      display: none;
    }
  }

  .feed-category-row {
    background-color: $light-color;
    padding: 0.5rem 1rem;

    .filter-button {
      svg {
        height: 0.8rem;
      }

      span {
        vertical-align: middle;
      }

      @include smallest {
        font-size: 14px;
      }
    }
  }

  .not-bootstrap-row {
    background-color: $actions_ribbon_background_color;
    display: flex;
    align-items: center;
    padding: 0 1rem;

    @include smallest {
      background-color: $background_color;
      border-bottom: 0.075rem solid $search_nav_border_color;
      padding: 0 8px;
    }

    .button-plain {
      color: inherit;
      font-weight: 600;
      padding: 0.625rem 0;
      margin-left: 1rem;
      border-bottom: 0.1rem solid transparent;

      @include smallest {
        font-size: 14px;
        margin-left: 0;
        flex-grow: 1;
        flex-basis: 0;
        padding-bottom: 0.45rem;
        border-bottom-width: 0.075rem;
        margin-bottom: -0.075rem;
      }

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        color: $primary_color;
      }

      &.active {
        color: $custom_links_color;
        border-bottom-color: $custom_links_color;
      }
    }

    .separator {
      flex-grow: 1;

      @include smallest {
        display: none;
      }
    }
  }
}
</style>
