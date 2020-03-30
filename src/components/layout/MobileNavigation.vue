<template>
  <div
    class="mobile-navigation clearfix"
    :class="[
      (open ? 'open' : ''),
      ($route.name !== 'home' ? 'sticky' : ''),
    ]"
    v-show="$route.name !== 'home' || !isMobileNavigationHidden"
  >
    <div
      class="close-navigation"
      v-if="open"
      @click="openNavigation(false)"
    >
      &#x2715;
    </div>
    <navigation/>
    <div class="mobile-actions">
      <img
        class="tip"
        :src="emptyHeart"
        @click="toggleTipModal(true)"
        v-if="!open && $route.name === 'home'"
        v-show="Object.keys(account).length && balance"
      >
      <img
        class="trigger-search"
        :src="iconSearch"
        @click="toggleMobileNavigation(true)"
        v-if="!open && $route.name === 'home'"
      >
      <img
        class="trigger-navigation"
        :src="iconMobileMenu"
        @click="openNavigation(true)"
        v-if="!open"
      >
    </div>
    <div class="footer text-center" v-if="open">
      SuperHero is Open Source
      <router-link class="ae" to="/terms">
        Terms
      </router-link>
      <router-link class="ae" to="/privacy">
        Privacy
      </router-link>
    </div>
    <mobile-send-tip-modal></mobile-send-tip-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Navigation from './Navigation.vue';
import iconMobileMenu from '../../assets/iconMobileMenu.svg';
import iconSearch from '../../assets/iconSearch.svg';
import emptyHeart from '../../assets/emptyHeart.svg';
import MobileSendTipModal from '../modals/MobileSendTipModal.vue';

export default {
  name: 'MobileNavigation',
  components: {
    Navigation,
    MobileSendTipModal,
  },
  data() {
    return {
      iconMobileMenu,
      iconSearch,
      emptyHeart,
      open: false,
    };
  },
  computed: {
    ...mapGetters(['isMobileNavigationHidden', 'isTipModalOpen', 'balance', 'account']),
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
    padding: .75rem .6rem .75rem 1rem;
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
      max-width: fit-content;;
      text-align: right;
      width: 100%;

      img {
        margin-left: 1rem
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

      .navigation__item.trending {
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
