<template>
  <div class="header">
    <div class="header__left_section">
      <div class="content">
        <img src="../../assets/headerLogo.svg">
      </div>
    </div>
    <div class="header__body container">
      <slot></slot>
    </div>
    <div class="header__right_section">
      <a class="redeem__tip colorful-buttons secondary" href="/">
        Redeem Tip
      </a>
      <a class="send__tip colorful-buttons" href="/">
        Send Tip
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HeaderComponent',
    data() {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/base";
.colorful-buttons{
  background-color: $colorful_buttons_background_primary;
  color: $custom_links_color;
  padding: .65rem .4rem .65rem .4rem ;
  border-radius: .25rem;
  margin-right: 0;
  font-size: .56rem;
  font-weight: 600;
  display: inline-block;
  &.secondary{
    background-color: $colorful_buttons_background_secondary;
    color: $secondary_color;
    margin-right: 0.125rem;
  }
}
.header{
  background-color: $background_color;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  font-size: .75rem;
  margin: 0 1rem 0 0;
  min-height: 3rem;
  padding-top: .5rem;
  .header__left_section{
    display: inline-block;
    text-align: right;
    .content{
      width: 12.5rem;
      display: inline-block;
      text-transform: uppercase;
      text-align: left;
      padding-left: 2rem;
      img{
        width: 6rem;
      }
    }
  }
  .header__right_section{
    display: inline-block;
    text-align: left;
    img{
      width: 6rem;
    }
  }
}
.header__body{
  width: 100%;
  min-height: 1.5rem;
  display: inline-block;
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .header .header__body{
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }
    .header .header__left_section{display:none}
  }

</style>
