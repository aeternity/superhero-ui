<template>
  <div class="app__leftcolumn">
    <div class="content">
      <div class="navigation">
        <div class="navigation__item"><a>Home</a></div>
        <div class="navigation__item"><a>Trending</a></div>
        <div class="navigation__item"><a>Mission</a></div>
        <div class="navigation__item"><a>Create Profile</a></div>
      </div>
      <div class="side__button"><a>Install Wallet</a></div>
      <div class="side__button secondary"><a>Get Tokens</a></div>
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
  export default {
    name: 'LeftSectionComponent',
    data() {
      return {}
    },
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
    width: 6rem;
    margin-top: 1rem;
    display: inline-block;
    width: 6rem;
    text-transform: uppercase;
    text-align: left;
    .navigation{
      margin-bottom: 1rem;
    }
    .navigation__item, .side__button{
      margin-bottom: .5rem;
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
      background-color: $actions_ribbon_background_color;
      padding: .5rem;
      border-radius: .25rem;
      border: .065rem solid $panel_border_color;
      .overview__value{
        color: $custom_links_color;
        font-size: .75rem;
        &.secondary{
          color: $secondary_color;
        }
      }
      .overview__label{
        margin-bottom: .5rem;
        &:last-child{margin-bottom: none;}
      }
    }
  }
}

</style>
