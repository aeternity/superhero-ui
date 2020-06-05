<template>
  <div
    class="search"
    :class="{
      'show-mobile-nav': showMobileNavigation,
      'sided': !toggleMobileNav,
    }"
  >
    <input
      v-model="searchTermValue"
      type="text"
      class="search-input"
      :placeholder="$t('views.TipList.SearchPlaceholder')"
      @searchTopic="onSearchTopic"
    >
    <div
      v-if="searchTermValue.length"
      class="clear"
      :title="$t('views.TipList.Clear')"
      @click="setSearchTerm('')"
    >
      <img src="../../assets/iconEraser.svg">
    </div>
    <div
      v-if="!searchTermValue.length"
      class="search-icon"
    >
      <img src="../../assets/iconSearch.svg">
    </div>
    <div
      class="close-mobile-nav"
      :title="$t('views.TipList.CloseSearch')"
      @click="toggleMobileNav(true)"
    >
      <!--eslint-disable-line vue-i18n/no-raw-text-->
      &#x2715;
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { EventBus } from '../../utils/eventBus';

export default {
  name: 'SearchInput',
  props: {
    showMobileNavigation: { type: Boolean },
    toggleMobileNav: { type: Function, required: false, default: null },
  },
  computed: {
    ...mapGetters(['searchTerm']),
    searchTermValue: {
      get() {
        return this.searchTerm;
      },
      set(value) {
        this.setSearchTerm(value);
      },
    },
  },
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
    ...mapActions(['setSearchTerm']),
    onSearchTopic(data) {
      this.setSearchTerm(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 0.15rem;
  position: relative;
  display: none;
}

.search-input {
  font-size: 0.75rem;
  color: $standard_font_color;
  background-color: $article_content_color;
  padding: 1.05rem 2.5rem 1.05rem 1rem;
  border: 0.05rem solid transparent;
  outline: none;
  width: 100%;

  &:focus {
    border: 0.05rem solid $secondary_color;
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

.search-input:focus ~ .search-icon {
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

.sided.search {
  display: block;
  margin-bottom: 0.5rem;

  input {
    height: 2.2rem;
    border-radius: 0.25rem;
  }

  .search-icon {
    line-height: 0.91rem;

    img {
      width: 0.91rem;
      height: 0.91rem;
    }
  }

  .clear img {
    height: 0.65rem;
    width: 0.75rem;
    vertical-align: unset;
  }
}

@media (max-width: 1024px) {
  .sided.search {
    display: none;
  }

  .search {
    display: block;
  }
}

@media only screen
  and (max-width: 768px)
  and (max-width: 600px) {
  .input-group {
    margin-bottom: 0;
    padding-right: 0;
  }
}

@media (max-width: 1024px) {
  .close-mobile-nav {
    display: block;
    font-size: 1rem;
    color: $standard_font_color;
    right: 0.5rem;

    @include vertical-align($position: absolute);

    z-index: 10;

    &:hover {
      cursor: pointer;
    }
  }

  .search-icon {
    display: none;
  }

  .search.show-mobile-nav {
    display: none;
  }

  .clear {
    right: 1.8rem;

    img {
      vertical-align: baseline;
    }
  }

  .search-input {
    padding: 1.05rem 3.2rem 1.05rem 1rem;
  }
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .search-input {
    padding: 0.9rem 3.5rem 0.9rem 1rem;
  }
}
</style>
