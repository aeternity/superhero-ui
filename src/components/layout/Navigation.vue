<template>
  <div class="navigation">
    <div class="logo">
      <router-link :to="{ name: 'tips' }">
        <img
          alt=""
          src="../../assets/headerLogo.svg"
        >
      </router-link>
    </div>
    <div
      class="navigation__item tips"
      @click="scrollTop"
    >
      <router-link :to="{ name: 'tips' }">
        <div class="navigation__item__image" />
        <span>{{ $t('tips') }}</span>
      </router-link>
    </div>
    <div
      v-if="isLoggedIn"
      class="navigation__item profile"
      @click="scrollTop"
    >
      <router-link :to="{ name: 'user-profile', params: { address: account } }">
        <div class="navigation__item__image" />
        <span>{{ $t('components.layout.Navigation.MyProfile') }}</span>
      </router-link>
    </div>
    <div class="navigation__item league">
      <a
        href="https://league.superhero.com"
        target="_blank"
      >
        <div class="navigation__item__image" />
        <span>{{ $t('components.layout.Navigation.League') }}</span>
      </a>
    </div>
    <div class="navigation__item faq">
      <router-link :to="{ name: 'faq' }">
        <div class="navigation__item__image" />
        <span>{{ $t('FAQ') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navigation',
  computed: mapGetters(['account', 'isLoggedIn']),
  methods: {
    scrollTop() {
      document.scrollingElement.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss">
  .logo {
    margin-bottom: 1.25rem;

    img {
      width: 9.2rem;
      height: 2.1rem;
    }
  }

  .navigation {
    color: $standard_font_color;
    font-size: 1rem;
    font-weight: 500;
  }

  .navigation__item {
    font-size: 0.93rem;
    margin-bottom: 0.75rem;

    a {
      align-items: center;
      color: #fff;
      cursor: pointer;
      display: flex;
      line-height: 1;
    }

    a:hover,
    .router-link-exact-active {
      color: $custom_links_color;
      text-decoration: none;
    }
  }

  .navigation__item__image {
    display: inline-block;
    height: 1.3rem;
    margin-right: 0.5rem;
    width: 1.3rem;

    .tips & {
      background-image: url('../../assets/iconTips.svg');
    }

    .profile & {
      background-image: url('../../assets/iconUser.svg');
    }

    .faq & {
      background-image: url('../../assets/iconHelp.svg');
    }

    .league & {
      background-image: url('../../assets/iconDiamond.svg');
      background-repeat: no-repeat;
      background-position: center;
    }

    a:hover &,
    .router-link-exact-active & {
      .tips & {
        background-image: url('../../assets/iconTipsActive.svg');
      }

      .profile & {
        background-image: url('../../assets/iconUserActive.svg');
      }

      .faq & {
        background-image: url('../../assets/iconHelpActive.svg');
      }
    }
  }

  @media (min-width: 1440px) {
    .navigation__item {
      color: #fff;
      font-size: 1rem;
      height: 1.2rem;
      line-height: 1.2rem;
      margin-bottom: 1.55rem;
    }
  }
</style>
