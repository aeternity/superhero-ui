<template>
  <!-- TODO: Extract overlay to a separate component -->
  <div
    v-if="showOverlay"
    class="mobile-navigation-overlay"
  >
    <ButtonPlain
      class="close-button"
      @click="showOverlay = false"
    >
      <!--eslint-disable-line vue-i18n/no-raw-text-->
      &#x2715;
    </ButtonPlain>
    <Navigation mobile />
    <FooterSection />
  </div>
  <SearchFeed
    v-else-if="isTipsRoute && showSearchFeed"
    class="mobile-navigation-sticky"
    @close="showSearchFeed = false"
  />
  <div
    v-else
    class="mobile-navigation-sticky mobile-navigation"
  >
    <RouterLink
      class="logo"
      to="/"
    >
      <img src="../../assets/headerLogo.svg">
    </RouterLink>

    <div class="separator" />

    <a
      v-if="!useSdkWallet && isTipsRoute"
      :href="tipDeepLink"
    >
      <IconDiamond />
    </a>
    <ButtonPlain
      v-if="isTipsRoute"
      @click="showSearchFeed = true"
    >
      <IconSearch />
    </ButtonPlain>
    <ButtonPlain @click="showOverlay = true">
      <IconMobileMenu />
    </ButtonPlain>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from './Navigation.vue';
import FooterSection from './FooterSection.vue';
import SearchFeed from './SearchFeed.vue';
import { createDeepLinkUrl } from '../../utils';
import IconDiamond from '../../assets/iconDiamond.svg?icon-component';
import IconSearch from '../../assets/iconSearch.svg?icon-component';
import IconMobileMenu from '../../assets/iconMobileMenu.svg?icon-component';
import ButtonPlain from '../ButtonPlain.vue';

export default {
  components: {
    Navigation,
    FooterSection,
    SearchFeed,
    IconDiamond,
    IconSearch,
    IconMobileMenu,
    ButtonPlain,
  },
  data: () => ({
    showOverlay: false,
    showSearchFeed: false,
    tipDeepLink: createDeepLinkUrl({ type: 'tip' }),
  }),
  computed: {
    ...mapState('aeternity', ['useSdkWallet']),
    isTipsRoute() {
      return ['feed', 'feed-search'].includes(this.$route.name);
    },
  },
  watch: {
    $route() {
      this.showOverlay = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-navigation-overlay,
.mobile-navigation {
  background-color: $background_color;
}

.mobile-navigation-overlay {
  z-index: 101;
  color: $light_font_color;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;

  .close-button {
    float: right;
    color: $standard_font_color;
  }

  .navigation {
    margin-top: 1.5rem;
  }
}

.mobile-navigation {
  padding-right: 0.6rem;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  .logo img {
    width: 9.2rem;
  }

  .separator {
    flex-grow: 1;

    ~ * {
      margin-left: 1rem;
    }
  }

  a:not(.logo),
  .button-plain {
    svg {
      color: $standard_font_color;
      height: 1.1rem;
    }
  }
}

.mobile-navigation-sticky {
  z-index: 101;
  position: sticky;
  top: 0;
  width: var(--container-width);
  height: $mobile_navigation_height;
  margin: 0 auto;

  @media (min-width: 1025px) {
    display: none;
  }

  @include smallest {
    width: 100%;
  }
}
</style>
