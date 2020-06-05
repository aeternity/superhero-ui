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
        <IconTips class="navigation__item__image" />
        <span>{{ $t('tips') }}</span>
      </router-link>
    </div>
    <div
      v-if="isLoggedIn"
      class="navigation__item profile"
      @click="scrollTop"
    >
      <router-link :to="{ name: 'user-profile', params: { address: account } }">
        <IconUser class="navigation__item__image" />
        <span>{{ $t('components.layout.Navigation.MyProfile') }}</span>
      </router-link>
    </div>
    <div class="navigation__item league">
      <router-link :to="{ name: 'league' }">
        <IconDiamond class="navigation__item__image" />
        <span>{{ $t('components.layout.Navigation.League') }}</span>
      </router-link>
    </div>
    <div class="navigation__item faq">
      <router-link :to="{ name: 'faq' }">
        <IconHelp class="navigation__item__image" />
        <span>{{ $t('FAQ') }}</span>
      </router-link>
    </div>
    <div class="navigation__item networking">
      <router-link :to="{ name: 'networking' }">
        <span>{{ $t('Networking') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IconTips from '../../assets/iconTips.svg?icon-component';
import IconUser from '../../assets/iconUser.svg?icon-component';
import IconHelp from '../../assets/iconHelp.svg?icon-component';
import IconDiamond from '../../assets/iconDiamond.svg?icon-component';

export default {
  name: 'Navigation',
  components: {
    IconTips,
    IconUser,
    IconHelp,
    IconDiamond,
  },
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

    .league & {
      padding: 0.2rem;
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
