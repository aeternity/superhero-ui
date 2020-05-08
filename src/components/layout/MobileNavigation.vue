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
      &#x2715;
    </div>
    <Navigation />
    <div
      v-if="!open"
      class="mobile-actions"
    >
      <img
        v-if="!USE_DEEP_LINKS && $route.name === 'tips'"
        v-show="Object.keys(account).length && balance"
        class="tip mobile-only"
        src="../../assets/iconDiamond.svg"
        @click="toggleTipModal(true)"
      >
      <a
        v-else-if="USE_DEEP_LINKS && $route.name === 'tips'"
        :href="createDeepLinkUrl({ type: 'tip' })"
        target="_blank"
        class="mobile-only"
      >
        <img
          class="tip"
          src="../../assets/iconDiamond.svg"
        >
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
    <MobileSendTipModal />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Navigation from './Navigation.vue';
import MobileSendTipModal from '../modals/MobileSendTipModal.vue';
import FooterSection from './FooterSection.vue';
import { USE_DEEP_LINKS, createDeepLinkUrl } from '../../utils/util';

export default {
  name: 'MobileNavigation',
  components: {
    Navigation,
    MobileSendTipModal,
    FooterSection,
  },
  props: {
    showMobileNavigation: { type: Boolean },
    toggleMobileNav: { type: Function, required: false, default: null },
  },
  data() {
    return {
      open: false,
      USE_DEEP_LINKS,
      createDeepLinkUrl,
    };
  },
  computed: mapGetters(['balance', 'account']),
  methods: {
    ...mapActions(['toggleTipModal']),
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

    img {
      width: 6.4rem;
      height: 1.5rem;
    }
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

@media (max-width: 991px) {
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
