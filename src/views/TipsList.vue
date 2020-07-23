<template>
  <Page>
    <div class="wrapper">
      <div class="tips__container">
        <div class="actions__container position-sticky">
          <SendTip class="send__tip__container" />
          <div class="row">
            <div class="col-md-12 col-lg-12 col-sm-12 sorting">
              <a
                :class="{ active: tipSortBy === 'hot' }"
                @click="setTipSortBy('hot')"
              >
                {{ $t('views.TipList.SortingMostPopular') }}
              </a>
              <a
                id="sort-latest"
                :class="{ active: tipSortBy === 'latest' }"
                @click="setTipSortBy('latest')"
              >
                {{ $t('views.TipList.SortingLatest') }}
              </a>
              <a
                :class="{ active: tipSortBy === 'highest' }"
                @click="setTipSortBy('highest')"
              >
                {{ $t('views.TipList.SortingHighestRated') }}
              </a>
              <div class="actions-menu">
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
          </div>
        </div>
        <TipsPagination
          :tip-sort-by="tipSortBy"
          :search="query"
          :blacklist="isHiddenContent"
        />
      </div>
    </div>
  </Page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SendTip from '../components/layout/sendTip/SendTip.vue';
import Page from '../components/layout/Page.vue';
import TipsPagination from '../components/TipsPagination.vue';
import ThreeDotsMenu from '../components/ThreeDotsMenu.vue';
import Checkbox from '../components/Checkbox.vue';

export default {
  name: 'TipsList',
  components: {
    TipsPagination,
    Page,
    SendTip,
    Checkbox,
    ThreeDotsMenu,
  },
  props: {
    query: { type: String, default: '' },
  },
  computed: mapState(['tipSortBy', 'isHiddenContent']),
  methods: mapMutations(['setTipSortBy', 'setIsHiddenContent']),
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding-top: 0;
  min-height: 4rem;
}

.actions__container {
  padding: 0;
  top: 0;
  z-index: 100;
  font-size: 0.75rem;
  background-color: $background_color;

  .form-control {
    padding-right: 1.25rem;
  }

  .row {
    background-color: $actions_ribbon_background_color;
    margin: 0;
  }

  .sorting {
    text-align: left;
    padding-left: 1rem;

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
}

.tips__container {
  width: 100%;
  background-color: $background_color;

  @media (min-width: 1025px) {
    padding-top: 0.1rem;
  }
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

.send__tip__container {
  margin-bottom: 0.15rem;
}

@media (max-width: 1024px) {
  .actions__container {
    top: $mobile_navigation_height;
  }
}

@media only screen
  and (max-width: 768px)
  and (max-width: 600px) {
  .actions__container {
    padding-bottom: 0;

    .input-group {
      margin-bottom: 0;
      padding-right: 0;
    }
  }
}

@include smallest {
  .actions__container {
    width: 100%;
    background-color: $actions_ribbon_background_color;
    overflow-x: initial;
    z-index: 100;

    .row {
      padding: 0;
    }

    .sorting {
      width: -webkit-fill-available;
      width: -moz-available;
      background-color: #1d1d23;
      margin: 0 -1rem 0 -1rem;
      text-align: center;
      padding-bottom: 0;
      padding-left: 0.5rem;
      border-bottom: 0.075rem solid $search_nav_border_color;

      a {
        cursor: pointer;
        width: 30%;
        display: inline-block;
        padding-bottom: 0.45rem;
        margin-right: 0;

        &.active {
          border-bottom: 0.075rem solid $custom_links_color;
          margin-bottom: -0.075rem;
        }
      }
    }
  }

  .wrapper {
    padding: 0.15rem 0.25rem 0 0.25rem;

    .actions__container {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .send__tip__container {
    display: none;
  }

  .actions-menu {
    float: initial;
  }

  .search {
    margin-bottom: 0;
  }
}
</style>
