<template>
  <div class="app__leftcolumn">
    <div class="content">
      <div class="navigation">
        <div class="navigation__item home">
          <a @click="goHome()">
            <img class="mr-1" src="../../assets/iconHome.svg">
            Home
          </a>  
        </div>
        <div class="navigation__item">
          <a>
            <img class="mr-1" src="../../assets/iconTrending.svg">Trending
          </a>
        </div>
        <div class="navigation__item">
          <a><img class="mr-1" src="../../assets/iconMission.svg">Mission</a>
        </div>
        <div class="navigation__item" v-if="!isLoggedIn"><a><img class="mr-1 avatar" src="../../assets/userAvatar.svg">Create Profile</a></div>
         <div class="navigation__item" v-if="isLoggedIn"><a @click="openMyProfile"><img class="mr-1 avatar" src="../../assets/userAvatar.svg">My Profile</a></div>
      </div>
      <div class="overview">
        <div class="overview__item">
          <div class="overview__value">
            158,057
          </div>
          <div class="overview__label">
            Tips Aggregated
          </div>
        </div>
        <div class="overview__item">
          <div class="overview__value secondary">
            2.768,321 <span class="currency secondary">AE</span>
          </div> 
          <div class="overview__value">
            553,664 <span class="currency">AE</span>
          </div>
          <div class="overview__label">
            Total Tips Value
          </div>
        </div>
        <div class="overview__item">
          <div class="overview__value">
            217,515
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
  export default {
    name: 'LeftSectionComponent',
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
      ...mapGetters(['account', 'isLoggedIn'])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/base";
.app__leftcolumn{
  color: $standard_font_color;
  display: inline-block;
  font-size: .55rem;
  position: fixed;
  text-align: right;
  .content{
    width: 12.5rem;
    margin-top: 1rem;
    display: inline-block;
    text-transform: uppercase;
    text-align: left;
    padding-left: 2rem;
    .navigation{
      margin-bottom: 1rem;
      font-weight: 600;
      .avatar{
        width: 1.2rem;
      }
    }
    .navigation__item, .side__button{
      font-size: .75rem;
      text-transform: capitalize;
      margin-bottom: 0.7rem;
      &:hover{
        cursor: pointer;
      }
    }
    .side__button{
      color: $custom_links_color;
      border: .065rem solid $custom_links_color;
      border-radius: .25rem;
      padding: .1rem .5rem .1rem .5rem;
      text-align: center;
      &.secondary{
        color: $secondary_color;
        border: .065rem solid $secondary_color;
        margin-bottom: 1rem;
      }
    }
    .overview{
      margin-top: 2rem;
      .overview__value{
        color: $custom_links_color;
        font-size: 1rem;
        &.secondary{
          color: $secondary_color;
        }
      }
      .overview__label{
        margin-bottom: .5rem;
        text-transform: none;
        color: $light_font_color;
        &:last-child{margin-bottom: none;}
      }
    }
  }
}

@media (min-width: 768px) {
  .app__leftcolumn {
    .content {
      width: 12.5rem;
    } 
  }
}

@media (min-width: 992px) {
  .app__leftcolumn {
    .content {
      width: 12.5rem;
    } 
  }
}

@media (min-width: 1200px) {
  .app__leftcolumn {
    .content {
      width: 12.5rem;
    } 
  }
}

@media only screen and (max-width: 768px) {
  .app__leftcolumn {
    .content {
      width: 10rem;
    } 
  }
}

</style>
