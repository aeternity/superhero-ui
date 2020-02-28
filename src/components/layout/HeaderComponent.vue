<template>
  <div class="header">
    <div class="header__left_section">
      <div class="content">
        <img src="../../assets/headerLogo.svg">
      </div>
    </div>
    <div class="header__body">
      <slot></slot>
    </div>
    <div class="header__right_section">
      <div class="header__buttons">
        <div>
          <a class="redeem__tip colorful-buttons secondary" href="">Redeem Tip</a>
        </div>
        <div>
          <a class="send__tip colorful-buttons" href="">Send Tip</a>
        </div>
      </div>
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
  padding: .75rem 1rem .75rem 1rem;
  border-radius: .25rem;
  margin-right: 0;
  font-size: .65rem;
  font-weight: 600;
  &.secondary{
    background-color: $colorful_buttons_background_secondary;
    color: $secondary_color;
    margin-right: 0.125rem;
  }
}
.header{
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  font-size: .75rem;
  margin: 0 1rem 0 0;
  min-height: 3rem;
  .header__left_section{
    width: calc(50% - 17.7rem);
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
    .header__buttons {
      display: flex;
    }
  }
}
.header__body{
  width: 33rem;
  min-height: 1.5rem;
  display: inline-block;
  padding-left: .75rem;
  padding-right: .75rem;
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

@media only screen and (max-width: 576px) {
  .header__body.header__body {
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .header__body {
    width: 27rem;
    padding-left: .6rem;
    padding-right: .9rem;
  }
  .header .header__left_section{
    width: calc(50% - 13.5rem);
    img{
      display: none;
    }
  }
  .header .header__right_section {
    display: none;
  }
}


@media (min-width: 768px) {
  .header__body {
    width: 27rem;
    padding-left: .75rem;
    padding-right: .75rem;
  }
  .header .header__left_section{
    width: calc(50% - 13.5rem);
    padding-right: 0.5rem;
  }
  .header .header__right_section{
    width: calc(50% - 16rem);
    padding-right: 0.5rem;
  }
  .colorful-buttons {
    font-size: .55rem;
  }
}

@media (min-width: 992px) {
  .header .header__body {
    width: 30rem;
  }
  .header .header__left_section{
    width: calc(50% - 15.2rem);
    padding-right: 0.5rem;
  }
  .header .header__right_section{
    width: calc(50% - 16rem);
    padding-right: 0.5rem;
  }
}

@media (min-width: 1200px) {
  .header .header__body {
    width: 35rem;
    padding-left: .75rem;
    padding-right: .75rem;
  }
  .header .header__left_section{
    width: calc(50% - 17.7rem);
    padding-right: 0.5rem;
  }
  .header .header__right_section{
    width: calc(50% - 18rem);
    padding-right: 0.5rem;
  }
}

@media only screen and (max-width: 768px) {
  .header .header__body {
    width: 100%;
  }
  .header .header__left_section {
    display: none;
  }
  .header .header__right_section {
    display: none;
  }
}

</style>
