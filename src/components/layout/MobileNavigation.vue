<template>
  <!-- TODO: Extract overlay to a separate component -->
  <div
    v-if="showOverlay"
    class="mobile-navigation-overlay"
  >
    <button
      class="close-button"
      @click="showOverlay = false"
    >
      <!--eslint-disable-line vue-i18n/no-raw-text-->
      &#x2715;
    </button>
    <Navigation mobile />
    <FooterSection />
  </div>
  <SearchInput
    v-else-if="isTipsRoute && showSearchInput"
    class="mobile-navigation-sticky"
    @close="showSearchInput = false"
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
    <button
      v-if="isTipsRoute"
      @click="showSearchInput = true"
    >
      <IconSearch />
    </button>
    <button @click="showOverlay = true">
      <IconMobileMenu />
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from './Navigation.vue';
import FooterSection from './FooterSection.vue';
import SearchInput from './SearchInput.vue';
import { createDeepLinkUrl } from '../../utils/util';
import IconDiamond from '../../assets/iconDiamond.svg?icon-component';
import IconSearch from '../../assets/iconSearch.svg?icon-component';
import IconMobileMenu from '../../assets/iconMobileMenu.svg?icon-component';

export default {
  name: 'MobileNavigation',
  components: {
    Navigation,
    FooterSection,
    SearchInput,
    IconDiamond,
    IconSearch,
    IconMobileMenu,
  },
  data: () => ({
    showOverlay: false,
    showSearchInput: false,
    tipDeepLink: createDeepLinkUrl({ type: 'tip' }),
  }),
  computed: {
    ...mapState(['useSdkWallet']),
    isTipsRoute() {
      return ['tips', 'tips-search'].includes(this.$route.name);
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

  button {
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }
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
  button {
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
