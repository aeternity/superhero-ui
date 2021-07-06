<template>
  <!-- TODO: Extract overlay to a separate component -->
  <div class="mobile-navigation-sticky mobile-navigation">
    <Transition name="slide">
      <Modal
        v-if="showOverlay"
        @close="showOverlay = false"
      >
        <div class="mobile-navigation-overlay">
          <ButtonPlain
            class="close-button"
            @click="showOverlay = false"
          >
            &#x2715;
          </ButtonPlain>
          <Navigation mobile />
          <FooterSection />
        </div>
      </Modal>
    </Transition>
    <SearchFeed
      v-if="isOnFeed && showSearchFeed"
      class="mobile-navigation-sticky"
      @close="showSearchFeed = false"
    />
    <template v-else>
      <RouterLink
        class="logo"
        to="/"
      >
        <img src="../../assets/headerLogo.svg">
      </RouterLink>

      <div class="separator" />

      <a
        v-if="!useSdkWallet && isOnFeed"
        :href="tipDeepLink"
      >
        <IconWallet />
      </a>
      <ButtonPlain
        v-if="isOnFeed"
        @click="showSearchFeed = true"
      >
        <IconSearch />
      </ButtonPlain>
      <ButtonPlain @click="showOverlay = true">
        <IconMobileMenu />
      </ButtonPlain>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navigation from './Navigation.vue';
import FooterSection from './FooterSection.vue';
import SearchFeed from './SearchFeed.vue';
import { createDeepLinkUrl } from '../../utils';
import IconWallet from '../../assets/iconWallet.svg?icon-component';
import IconSearch from '../../assets/iconSearch.svg?icon-component';
import IconMobileMenu from '../../assets/iconMobileMenu.svg?icon-component';
import ButtonPlain from '../ButtonPlain.vue';
import Modal from '../Modal.vue';

export default {
  components: {
    Navigation,
    FooterSection,
    SearchFeed,
    IconWallet,
    IconSearch,
    IconMobileMenu,
    ButtonPlain,
    Modal,
  },
  data: () => ({
    showOverlay: false,
    showSearchFeed: false,
    tipDeepLink: createDeepLinkUrl({ type: 'tips' }),
  }),
  computed: {
    ...mapState('aeternity', ['useSdkWallet']),
    isOnFeed() {
      return this.$route.name === 'feed';
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
  right: 0;
  bottom: 0;
  left: 50%;
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
  padding-right: 8px;
  padding-left: 8px;
  display: flex;
  align-items: center;

  img,
  svg {
    display: block;
  }

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

  @include above-mobile {
    display: none;
  }

  @include smallest {
    width: 100%;
  }
}

::v-deep .modal {
  .overlay {
    background-color: rgba($background_color, 0.6);
  }

  &.slide-enter-active,
  &.slide-enter-active .mobile-navigation-overlay,
  &.slide-enter-active .mobile-navigation-overlay .navi,
  &.slide-leave-active,
  &.slide-leave-active .mobile-navigation-overlay {
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  &.slide-leave-active,
  &.slide-leave-active .mobile-navigation-overlay {
    transition-duration: 0.2s;
  }

  &.slide-enter .mobile-navigation-overlay,
  &.slide-leave-to .mobile-navigation-overlay {
    transform: translateX(100%);
  }

  &.slide-leave-to .mobile-navigation-overlay {
    opacity: 0;
  }
}
</style>
