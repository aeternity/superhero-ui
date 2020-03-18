<template>
  <div class="app__leftcolumn">
    <div class="content">
      <div class="logo">
        <img @click="goHome()" src="../../assets/headerLogo.svg">
      </div>
      <div class="navigation">
        <div class="navigation__item home" v-bind:class="{ active: $route.name === 'home' }">
          <a @click="goHome()">
             <div class="navigation__item__image"></div>
            <span >Home</span>
          </a>
        </div>
        <div class="navigation__item trending" v-bind:class="{ active: $route.name === 'trending' }">
          <a>
            <div class="navigation__item__image"></div>
            <span>Trending</span>
          </a>
        </div>
        <div class="navigation__item mission" v-bind:class="{ active: $route.name === 'mission' }">
          <router-link to="/mission">
            <div class="navigation__item__image"></div>
            <span>Mission</span>
          </router-link>
        </div>
        <div class="navigation__item profile" v-if="!isLoggedIn" v-bind:class="{ active: $route.name === 'user-profile' }">
          <router-link to="/create-profile">
            <img class="mr-1 avatar" src="../../assets/userAvatar.svg">
            <span>Create Profile</span>
          </router-link>
        </div>
        <div class="navigation__item profile" v-if="isLoggedIn" v-bind:class="{ active: $route.name === 'user-profile' }">
          <a @click="openMyProfile">
            <img class="mr-1 avatar" src="../../assets/userAvatar.svg">
            <span v-bind:class="{ active: $route.name === 'user-profile' }">My Profile</span>
          </a>
        </div>
      </div>
      <div class="overview">
        <div class="overview__item" v-if="stats.total_tips_length">
          <div class="overview__value">
            {{stats.total_tips_length}}
          </div>
          <div class="overview__label">
            Tips Aggregated
          </div>
        </div>
        <div class="overview__item" v-if="stats.comments">
          <div class="overview__value">
            {{stats.comments.total}}
          </div>
          <div class="overview__label">
            Comments
          </div>
        </div>
        <div class="overview__item" v-if="stats.senders_length">
          <div class="overview__value">
            {{stats.senders_length}}
          </div>
          <div class="overview__label">
            Unique Tip Senders
          </div>
        </div>
        <div class="overview__item" v-if="stats.total_amount">
          <div class="overview__value secondary">
            {{stats.total_amount}}
            <span class="currency secondary">AE</span>
          </div>
          <div class="overview__value" v-if="stats.total_amount">
            <fiat-value :amount="stats.total_amount" :withoutBrackets="true"></fiat-value>
          </div>
          <div class="overview__label">
            Total Tips Value
          </div>
        </div>
        <div class="overview__item" v-if="stats.height">
          <div class="overview__value">
            {{stats.height}}
          </div>
          <div class="overview__label">
            Latest Block
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FiatValue from "../FiatValue";

  export default {
    name: 'LeftSection',
    components: {
      FiatValue
    },
    data() {
      return {}
    },
    methods: {
      goHome() {
        this.$router.push({
          name: 'home',
        })
      },
      openMyProfile() {
        this.$router.push({
          name: 'user-profile',
          params: {
            address: this.account
          }
        })
      }
    },
    computed: {
      ...mapGetters(['stats', 'account', 'isLoggedIn'])
    }
  }
</script>

<style lang="scss">
  .app__leftcolumn {
    color: $standard_font_color;
    font-size: 1rem;
    text-align: right;
    .content {
      width: 10rem;
      display: inline-block;
      text-transform: uppercase;
      text-align: left;
      padding-left: 2rem;
      .logo{
        margin-bottom: 1.4rem;
        img{
          width: 8rem;
          &:hover{
            cursor: pointer;
          }
        }
      }
      .navigation {
        margin-bottom: 1rem;
        font-weight: 500;
        .avatar {
          width: 1.3rem;
        }
      }

      .navigation__item {
        font-size: .93rem;
        text-transform: capitalize;
        margin-bottom: 1rem;
        a{
          color: $standard_font_color;
          &:hover{
            text-decoration: none;
          }
        }
        .navigation__item__image{
          width: 26px;
          height: 26px;
          display: inline-block;
          transform: translateY(.3rem);
          margin-right: .2rem;
        }
        &.home .navigation__item__image{
          background-image: url('../../assets/iconHome.svg');
        }
        &.trending .navigation__item__image{
          background-image: url('../../assets/iconTrending.svg');
        }
        &.mission .navigation__item__image{
          background-image: url('../../assets/iconMission.svg');
        }
        &:hover, &.active {
          a{
            cursor: pointer;
            color: $custom_links_color;
          }
          &.home .navigation__item__image{
            background-image: url('../../assets/iconHomeActive.svg');
          }
          &.trending .navigation__item__image{
            background-image: url('../../assets/iconTrendingActive.svg');
          }
          &.mission .navigation__item__image{
            background-image: url('../../assets/iconMissionActive.svg');
          }
        }
      }

      .overview {
        margin-top: 2rem;
        font-weight: 100;
        .overview__value {
          color: $custom_links_color;
          font-size: 1rem;
          line-height: 1rem;
          font-weight: 300;
          &.secondary {
            color: $secondary_color;
          }
          .currency, .currency-value .currency-sign{
            font-size: .8rem;
          }
        }
        .overview__label {
          text-transform: none;
          color: $light_font_color;
          font-size: .75rem;
          margin-bottom: .5rem;
          font-weight: 400;
        }
      }
    }
  }

@media only screen and (min-width: 1300px) {
.app__leftcolumn .content .overview{
  .overview__value {
    font-size: 1.25rem;
    line-height: 1.5rem;
    font-weight: 300;
  }
  .overview__label{
    text-transform: none;
    color: $light_font_color;
    font-size: .75rem;
    margin-bottom: 1.15rem;
    font-weight: 400;
  }
}

}
</style>
