<template>
  <Page
    :toggle-mobile-nav="toggleMobileNav"
    :show-mobile-navigation="showMobileNavigation"
    :loading="loading.initial"
  >
    <div class="container wrapper">
      <div class="transactions-page">
        <div class="cover-section">
          <TimeMachineCover class="cover-photo" />
          <div class="cover-text">
            <h1>{{ $t('views.TimeMachine.Title') }}</h1>
            <p>{{ $t('views.TimeMachine.SubTitle') }}</p>
          </div>
        </div>
        <div class="actions">
          <div class="records-ribbon">
            <div
              :class="['records-action', { active: action === 'browse' }]"
              @click="action = 'browse'"
            >
              {{ $t('views.TimeMachine.BrowseRecords') }}
            </div>
            <div
              :class="['records-action', { active: action === 'new' }]"
              @click="action = 'new'"
            >
              {{ $t('views.TimeMachine.NewRecord') }}
            </div>
          </div>
          <div class="send-tip">
            <BrowseRecords v-if="action === 'browse'" />
            <SendTip
              v-if="action === 'new'"
              time-machine
            />
          </div>
          <div class="navigation">
            <a
              :class="{ active: sortBy === 'hot' }"
              @click="sortBy = 'hot'"
            >
              {{ $t('views.TimeMachine.SortingMostPopular') }}
            </a>
            <a
              :class="{ active: sortBy === 'latest' }"
              @click="sortBy = 'latest'"
            >
              {{ $t('views.TimeMachine.SortingLatest') }}
            </a>
            <a
              :class="{ active: sortBy === 'highest' }"
              @click="sortBy = 'highest'"
            >
              {{ $t('views.TimeMachine.SortingHighestRated') }}
            </a>
            <div class="actions-menu">
              <ThreeDotsMenu>
                <Checkbox
                  :state="isHiddenContent"
                  :update-state="setIsHiddenContent"
                  :text="$t('views.TimeMachine.SafeContentOnly')"
                />
              </ThreeDotsMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BrowseRecords from '../components/layout/sendTip/BrowseRecords.vue';
import SendTip from '../components/layout/sendTip/SendTip.vue';
import Page from '../components/layout/Page.vue';
import ThreeDotsMenu from '../components/ThreeDotsMenu.vue';
import Checkbox from '../components/Checkbox.vue';
import TimeMachineCover from '../assets/timeMachineCover.svg?icon-component';

export default {
  name: 'TimeMachine',
  components: {
    Page,
    BrowseRecords,
    Checkbox,
    ThreeDotsMenu,
    TimeMachineCover,
    SendTip,
  },
  data() {
    return {
      showMobileNavigation: true,
      sortBy: 'highest',
      action: 'browse',
    };
  },
  computed: mapState(['loading', 'isHiddenContent']),
  methods: {
    ...mapMutations(['setIsHiddenContent']),
    toggleMobileNav(show) {
      this.showMobileNavigation = show;
    },
  },
};
</script>

<style lang="scss" scoped>
.container.wrapper {
  padding-top: 0;
  margin-top: -0.125rem;
  min-height: 4rem;
}

.cover-photo {
  width: var(--container-width);
}

.cover-section {
  position: relative;

  h1 {
    font-size: 1.5rem;
    color: $secondary_color;
    font-weight: 600;
  }

  p {
    font-size: 0.85rem;
    color: $tip_note_color;
    font-weight: 400;
  }

  .cover-text {
    text-align: center;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}

.actions {
  position: sticky;
  padding: 0;
  top: 0;
  z-index: 100;
  font-size: 0.75rem;
  background-color: $background_color;
}

.records-ribbon {
  background-color: $actions_ribbon_background_color;
  border-bottom: 0.15rem solid $background_color;
  padding: 0.45rem 1rem;
}

.records-action {
  border-radius: 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: $light_font_color;
  display: inline-block;
  padding: 0.45rem 0.9rem;

  &.active {
    color: $custom_links_color;
    background-color: $light_color;
  }

  &:hover {
    cursor: pointer;
  }
}

.form-control {
  padding-right: 1.25rem;
}

.navigation {
  text-align: left;
  padding: 0 1rem;
  font-size: 0.8rem;
  background-color: $actions_ribbon_background_color;
  margin: 0;

  a {
    font-weight: 600;
    display: inline-block;
    padding: 0.625rem 0;
    margin-right: 1rem;
    color: $light_font_color;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: $primary_color;
      cursor: pointer;
    }
  }

  a.active {
    color: $custom_links_color;
    border-bottom: 0.1rem solid $custom_links_color;
  }
}

.transactions-page {
  width: 100%;
  background-color: $background_color;
  padding-top: 0.1rem;
}

.no-results {
  color: $standard_font_color;
  font-size: 0.75rem;
  margin-bottom: 4rem;
}

.actions-menu {
  float: right;
  margin-top: 0.5rem;
  display: inline-block;
  color: $light_font_color;
}

.send-tip {
  margin-bottom: 0.15rem;
}

@media (max-width: 1024px) {
  .actions {
    top: 3rem;
  }

  .cover-photo {
    display: none;
  }
}
</style>
