<template>
  <Page
    :toggle-mobile-nav="toggleMobileNav"
    :show-mobile-navigation="showMobileNavigation"
  >
    <Loading
      v-if="loading.initial"
      class="initial-loading"
    />
    <div v-else>
      <div class="actions__container container position-sticky">
        <div
          class="search__input__container"
          :class="{ 'show-mobile-nav': showMobileNavigation }"
        >
          <input
            v-model="searchTerm"
            type="text"
            class="search__input"
            :placeholder="$t('views.TipList.SearchPlaceholder')"
            @searchTopic="onSearchTopic"
          >
          <div
            v-if="searchTerm.length"
            class="clear"
            :title="$t('views.TipList.Clear')"
            @click="searchTerm = ''"
          >
            <img src="../assets/iconEraser.svg">
          </div>
          <div
            v-if="!searchTerm.length"
            class="search-icon"
            @click="searchTerm = ''"
          >
            <img src="../assets/iconSearch.svg">
          </div>
          <div
            class="close-mobile-nav"
            :title="$t('views.TipList.CloseSearch')"
            @click="toggleMobileNav(true)"
          >
            &#x2715;
          </div>
        </div>
      </div>
      <div class="container wrapper">
        <Onboarding />
        <div class="tips__container">
          <div class="send__tip__container">
            <SendTip />
          </div>
          <div class="actions__container position-sticky">
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
              </div>
            </div>
          </div>
          <TipsPagination
            :tip-sort-by="tipSortBy"
            :search="searchTerm"
          />
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SendTip from '../components/layout/SendTip.vue';
import Page from '../components/layout/Page.vue';
import { EventBus } from '../utils/eventBus';
import Loading from '../components/Loading.vue';
import Onboarding from '../components/onboarding/Wizard.vue';
import TipsPagination from '../components/TipsPagination.vue';

export default {
  name: 'TipsList',
  components: {
    TipsPagination,
    Onboarding,
    Loading,
    Page,
    SendTip,
  },
  data() {
    return {
      searchTerm: '',
      showMobileNavigation: true,
    };
  },
  computed: mapGetters(['tipSortBy', 'loading']),
  async created() {
    EventBus.$on('searchTopic', (topic) => {
      window.scrollTo(0, 0);
      this.onSearchTopic(topic);
    });

    if (this.$route.query.searchTopicPhrase) {
      this.onSearchTopic(this.$route.query.searchTopicPhrase);
    }
  },
  methods: {
    ...mapActions(['setTipSortBy']),
    onSearchTopic(data) {
      this.searchTerm = data;
    },
    toggleMobileNav(show) {
      this.showMobileNavigation = show;
    },
  },
};
</script>

<style lang="scss" scoped>
.search__input__container {
  margin-bottom: 0.15rem;
  position: relative;
}

.search__input {
  font-size: 0.75rem;
  color: $standard_font_color;
  background-color: $article_content_color;
  padding: 1.05rem 2.5rem 1.05rem 1rem;
  border: 0.05rem solid transparent;
  outline: none;
  width: 100%;

  &:focus {
    border: 0.05rem solid $custom_links_color;
  }
}

.send__tip__container {
  margin-bottom: 0.15rem;
}

.container.wrapper {
  padding-top: 0;
  margin-top: -0.125rem;
  min-height: 4rem;
}

.actions__container {
  padding: 0;
  top: 0;

  &:nth-child(2) {
    top: 3.2rem;
  }

  z-index: 100;
  font-size: 0.75rem;
  background-color: $background_color;

  .form-control {
    padding-right: 1.25rem;
  }

  .container {
    padding: 0;
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
  padding-top: 0.1rem;

  &:empty {
    visibility: hidden;
  }
}

.search-icon,
.clear {
  @include vertical-align($position: absolute);

  right: 1rem;
  z-index: 10;
}

.search-icon img {
  width: 1.25rem;
  height: 1.25rem;
}

.search__input:focus ~ .search-icon {
  display: none;
}

.clear {
  img {
    height: 0.75rem;
    width: 0.9rem;
  }

  &:hover {
    cursor: pointer;
  }
}

.close-mobile-nav {
  display: none;
}

.no-results {
  color: $standard_font_color;
  font-size: 0.75rem;
  margin-bottom: 4rem;
}

.initial-loading {
  margin-top: 5rem;
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

@media (max-width: 1024px) {
  .close-mobile-nav {
    display: block;
    font-size: 1rem;
    color: $standard_font_color;
    right: 1rem;

    @include vertical-align($position: absolute);

    z-index: 10;

    &:hover {
      cursor: pointer;
    }
  }

  .search-icon {
    display: none;
  }

  .search__input__container.show-mobile-nav {
    display: none;
  }

  .clear {
    right: 2.2rem;

    img {
      vertical-align: baseline;
    }
  }

  .search__input {
    padding: 1.05rem 3.2rem 1.05rem 1rem;
  }
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .search__input {
    padding: 0.9rem 3.5rem 0.9rem 1rem;
  }

  .actions__container {
    width: 100%;
    background-color: $actions_ribbon_background_color;
    overflow-x: hidden;
    z-index: 100;

    &:nth-child(2) {
      width: 100vw;
      margin-left: -0.2rem;
      top: 3.1rem;
      padding-top: 0;
      padding-bottom: 0;
    }

    .container,
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
        width: 32.5%;
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

  .container.wrapper {
    padding: 0.15rem 0.25rem 0 0.25rem;

    .tips__container {
      padding: 0;
    }
  }

  .send__tip__container {
    display: none;
  }
}
</style>
