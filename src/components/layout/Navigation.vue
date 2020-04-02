<template>
  <div class="navigation">
    <div class="logo">
      <router-link :to="{ name: 'home' }">
        <img
          alt=""
          src="../../assets/headerLogo.svg"
        >
      </router-link>
    </div>
    <div class="navigation__item home">
      <router-link :to="{ name: 'home' }">
        <div class="navigation__item__image" />
        <span>Home</span>
      </router-link>
    </div>
    <div class="navigation__item trending">
      <router-link :to="{ name: 'home' }">
        <div class="navigation__item__image" />
        <span>Trending</span>
      </router-link>
    </div>
    <div class="navigation__item mission">
      <router-link :to="{ name: 'mission' }">
        <div class="navigation__item__image" />
        <span>Mission</span>
      </router-link>
    </div>
    <div
      v-if="isLoggedIn"
      class="navigation__item profile"
    >
      <router-link :to="{ name: 'user-profile', params: { address: account } }">
        <div class="navigation__item__image" />
        <span>My Profile</span>
      </router-link>
    </div>
    <div
      v-else
      class="navigation__item profile"
    >
      <router-link :to="{ name: 'create-profile' }">
        <div class="navigation__item__image" />
        <span>Create Profile</span>
      </router-link>
    </div>
    <div class="navigation__item faq">
      <router-link :to="{ name: 'faq' }">
        <div class="navigation__item__image" />
        <span>FAQ</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navigation',
  computed: {
    ...mapGetters(['account', 'isLoggedIn']),
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
    font-size: .93rem;
    margin-bottom: .75rem;

    a {
      align-items: center;
      color: #fff;
      cursor: pointer;
      display: flex;
      line-height: 1;
    }
    //TODO: Should be removed when Trending page is added
    &.trending .router-link-exact-active {
      color: $standard_font_color;
      &:hover{
        color: $custom_links_color;
      }
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
    margin-right: .5rem;
    width: 1.3rem;

    .home & {
      background-image: url('../../assets/iconHome.svg');
    }

    .trending & {
      background-image: url('../../assets/iconTrending.svg');
    }

    .profile & {
      background-image: url('../../assets/iconUser.svg');
    }

    .mission & {
      background-image: url('../../assets/iconMission.svg');
    }

    .faq & {
      background-image: url('../../assets/iconHelp.svg');
    }
    a:hover &,
    .router-link-exact-active & {
      .home & {
        background-image: url('../../assets/iconHomeActive.svg');
      }

      .profile & {
        background-image: url('../../assets/iconUserActive.svg');
      }

      .mission & {
        background-image: url('../../assets/iconMissionActive.svg');
      }

      .faq & {
        background-image: url('../../assets/iconHelpActive.svg');
      }
    }
    .navigation__item.trending  a:hover &{
      background-image: url('../../assets/iconTrendingActive.svg');
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
