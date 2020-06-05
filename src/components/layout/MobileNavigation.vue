<template>
  <div
    v-show="$route.name !== 'tips' || showMobileNavigation"
    class="mobile-navigation clearfix"
    :class="{
      open: open,
    }"
  >
    <div
      v-if="open"
      class="close-navigation"
      @click="openNavigation(false)"
    >
      <!--eslint-disable-line vue-i18n/no-raw-text-->
      &#x2715;
    </div>
    <Navigation />
    <div
      v-if="!open"
      class="mobile-actions"
    >
      <a
        v-if="!useSdkWallet && $route.name === 'tips'"
        :href="createDeepLinkUrl({ type: 'tip' })"
        target="_blank"
        class="mobile-only"
      >
        <IconDiamond class="tip" />
      </a>
      <img
        v-if="$route.name === 'tips'"
        class="trigger-search"
        src="../../assets/iconSearch.svg"
        @click="toggleMobileNav(false)"
      >
      <img
        class="trigger-navigation"
        src="../../assets/iconMobileMenu.svg"
        @click="openNavigation(true)"
      >
    </div>
    <FooterSection v-if="open" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Navigation from './Navigation.vue';
import FooterSection from './FooterSection.vue';
import { createDeepLinkUrl } from '../../utils/util';
import IconDiamond from '../../assets/iconDiamond.svg?icon-component';

export default {
  name: 'MobileNavigation',
  components: {
    Navigation,
    FooterSection,
    IconDiamond,
  },
  props: {
    showMobileNavigation: { type: Boolean },
    toggleMobileNav: { type: Function, required: false, default: null },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    ...mapState(['useSdkWallet']),
    ...mapGetters(['balance', 'account']),
  },
  methods: {
    createDeepLinkUrl,
    openNavigation(isOpen) {
      this.open = isOpen;
    },
  },
};
</script>

<style lang="scss">
.mobile-navigation {
  position: sticky;
  width: 100%;
  z-index: 101;
  top: 0;
  background-color: $background_color;
  color: $light_font_color;
  padding: 0.85rem 0.6rem 0.85rem 1rem;
  display: none;

  .logo {
    margin-bottom: 0;
  }

  .mobile-actions {
    display: inline-block;
    float: right;
    max-width: fit-content;
    text-align: right;
    width: 100%;

    img {
      margin-left: 1rem;
    }

    .tip {
      height: 0.9rem;
    }
  }

  .close-navigation {
    text-align: right;
    color: $standard_font_color;
  }

  .trigger-navigation:hover,
  .close-navigation:hover {
    cursor: pointer;
  }

  .navigation {
    display: inline-block;
  }

  .navigation__item {
    display: none;
  }

  .navigation__item__image {
    height: 1.65rem;
    width: 1.65rem;
  }

  &.open {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;

    .logo {
      display: none;
    }

    .navigation__item {
      display: block;
      min-width: 8rem;
    }
  }

  .mobile-only {
    display: none;
  }

  .trigger-search:hover {
    cursor: pointer;
  }
}

@media (max-width: 1024px) {
  .mobile-navigation {
    display: block;
    width: var(--container-width);
    margin: 0 auto;
  }
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .mobile-navigation {
    width: 100%;
    left: 0;
    padding: 0.75rem 0.6rem 0.75rem 1rem;

    .mobile-only {
      display: initial;
    }
  }
}
</style>
