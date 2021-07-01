<template>
  <div
    class="navigation"
    :class="{ mobile }"
  >
    <RouterLink
      v-if="!mobile"
      class="logo"
      to="/"
    >
      <img src="../../assets/headerLogo.svg">
    </RouterLink>

    <RouterLink
      exact
      :to="{ name: 'feed' }"
    >
      <IconTips />
      {{ $t('components.layout.Navigation.feed') }}
    </RouterLink>
    <RouterLink
      v-if="isLoggedIn"
      :to="{ name: 'user-profile', params: { address } }"
    >
      <IconUser />
      {{ $t('components.layout.Navigation.MyProfile') }}
    </RouterLink>
    <RouterLink
      v-if="showWordBazaar"
      :to="{ name: 'word-bazaar-assets' }"
    >
      <IconSmile />
      {{ $t('components.layout.Navigation.WordBazaar') }}
    </RouterLink>
    <RouterLink :to="{ name: 'voting' }">
      <IconGovernance />
      {{ $t('components.layout.Navigation.Governance') }}
    </RouterLink>
    <RouterLink :to="{ name: 'conference' }">
      <IconMeet />
      {{ $t('Networking.MenuLink') }}
    </RouterLink>
    <RouterLink :to="{ name: 'league' }">
      <IconDiamond />
      {{ $t('components.layout.Navigation.League') }}
    </RouterLink>
    <RouterLink :to="{ name: 'faq' }">
      <IconHelp />
      {{ $t('FAQ') }}
    </RouterLink>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import IconTips from '../../assets/iconTips.svg?icon-component';
import IconUser from '../../assets/iconUser.svg?icon-component';
import IconHelp from '../../assets/iconHelp.svg?icon-component';
import IconDiamond from '../../assets/iconDiamond.svg?icon-component';
import IconGovernance from '../../assets/iconGovernance.svg?icon-component';
import IconMeet from '../../assets/iconMeet.svg?icon-component';
import IconSmile from '../../assets/iconSmile.svg?icon-component';

export default {
  components: {
    IconTips,
    IconUser,
    IconHelp,
    IconDiamond,
    IconGovernance,
    IconMeet,
    IconSmile,
  },
  props: {
    mobile: Boolean,
  },
  data: () => ({ showWordBazaar: process.env.VUE_APP_WORDBAZAAR_ENABLED }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['address']),
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  a {
    display: block;
  }

  a.logo {
    margin-bottom: 2.5rem;

    img {
      display: block;
    }
  }

  a:not(.logo) {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 0.93rem;
    height: 1.3rem;
    line-height: 1.3rem;
    margin-left: 0.2rem;
    margin-bottom: 0.65rem;

    &:hover,
    &.router-link-active {
      color: $custom_links_color;
    }

    @include above-desktop-big {
      font-size: 1rem;
      margin-bottom: 1.45rem;
    }

    svg {
      height: 1em;
      width: 1em;
      margin-right: 0.7rem;
    }
  }

  &.mobile a:not(.logo) {
    font-size: 14px;
    margin-bottom: 8px;
  }
}
</style>
