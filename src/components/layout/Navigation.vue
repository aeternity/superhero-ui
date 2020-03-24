<template>
  <div class="navigation">
    <div class="logo">
      <router-link :to="{ name: 'home' }">
        <img alt="" src="../../assets/headerLogo.svg">
      </router-link>
    </div>
    <div class="navigation__item home">
      <router-link :to="{ name: 'home' }">
        <div class="navigation__item__image"></div>
        <span>Home</span>
      </router-link>
    </div>
    <div class="navigation__item trending">
      <router-link :to="{ name: 'home' }">
        <div class="navigation__item__image"></div>
        <span>Trending</span>
      </router-link>
    </div>
    <div class="navigation__item profile" v-if="isLoggedIn">
      <router-link :to="{ name: 'user-profile', params: { address: this.account }}">
        <div class="navigation__item__image"></div>
        <span>My Profile</span>
      </router-link>
    </div>
    <div class="navigation__item profile" v-else>
      <router-link :to="{ name: 'create-profile' }">
        <div class="navigation__item__image"></div>
        <span>Create Profile</span>
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
    height: 1.9rem;
    margin-bottom: 1.4rem;

    img {
      width: 8rem;
    }
  }

  .navigation {
    color: $standard_font_color;
    font-size: 1rem;
    font-weight: 500;
  }

  .navigation__item {
    font-size: .93rem;
    margin-bottom: 1rem;

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

    a:hover &,
    .router-link-exact-active & {
      .home & {
        background-image: url('../../assets/iconHomeActive.svg');
      }

      .trending & {
        background-image: url('../../assets/iconTrendingActive.svg');
      }

      .profile & {
        background-image: url('../../assets/iconUserActive.svg');
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
