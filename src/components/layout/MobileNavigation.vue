<template>
  <div
    v-show="$route.name !== 'tips' || !isMobileNavigationHidden"
    class="mobile-navigation clearfix"
    :class="{
      open: open,
      sticky: $route.name !== 'tips',
    }"
  >
    <div
      v-if="open"
      class="close-navigation"
      @click="openNavigation(false)"
    >
      &#x2715;
    </div>
    <navigation />
    <div
      v-if="!open"
      class="mobile-actions"
    >
      <img
        v-if="!this.USE_DEEP_LINKS && $route.name === 'tips'"
        v-show="Object.keys(account).length && balance"
        class="tip"
        src="../../assets/iconDiamond.svg"
        @click="toggleTipModal(true)"
      >
      <a
        v-else-if="this.USE_DEEP_LINKS && $route.name === 'tips'"
        :href="deepLink"
        target="_blank"
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
        @click="toggleMobileNavigation(true)"
      >
      <img
        class="trigger-navigation"
        src="../../assets/iconMobileMenu.svg"
        @click="openNavigation(true)"
      >
    </div>
    <footer-section v-if="open" />
    <mobile-send-tip-modal />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Navigation from './Navigation.vue';
import MobileSendTipModal from '../modals/MobileSendTipModal.vue';
import FooterSection from './FooterSection.vue';
import { USE_DEEP_LINKS } from '../../utils/util';

export default {
  name: 'MobileNavigation',
  components: {
    Navigation,
    MobileSendTipModal,
    FooterSection,
  },
  data() {
    return {
      open: false,
      USE_DEEP_LINKS
    };
  },
  computed: {
    ...mapGetters(['isMobileNavigationHidden', 'balance', 'account']),
    deepLink() {
      const url = new URL(`${process.env.VUE_APP_WALLET_URL}/tip`);
      url.searchParams.set('x-success', window.location);
      url.searchParams.set('x-cancel', window.location);
      return url;
    },
  },
  methods: {
    ...mapActions(['toggleMobileNavigation', 'toggleTipModal']),
    openNavigation(isOpen) {
      this.open = isOpen;
    },
  },
};
</script>
<style lang="scss">
  .mobile-navigation {
    position: fixed;
    width: 100%;
    z-index: 101;
    top: 0;
    background-color: $background_color;
    color: $light_font_color;
    padding: 0.75rem 0.6rem 0.75rem 1rem;
    display: none;

    &.sticky {
      position: sticky;
    }

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

      .logo {
        display: none;
      }

      .navigation__item {
        display: block;
        min-width: 8rem;
      }
    }
  }

  @media only screen
    and (min-device-width: 320px)
    and (max-device-width: 480px)
    and (-webkit-min-device-pixel-ratio: 2) {
    .mobile-navigation {
      display: block;
    }
  }
</style>
