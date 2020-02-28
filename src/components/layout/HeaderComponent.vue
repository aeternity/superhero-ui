<template>
  <div class="header">
    <div class="header__left_section">
      <img src="../../assets/headerLogo.svg">
    </div>
    <div class="header__body">
      <slot></slot>
    </div>
    <div class="header__right_section">
      <div class="header__buttons">
        <div >
          <a class="redeem__tip colorful-buttons" href="">Redeem Tip</a>
        </div>
        <div >
          <a class="redeem__tip colorful-buttons secondary" href="">Send Tip</a>
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
  padding: .25rem .5rem .25rem .5rem;
  border-radius: .25rem;
  margin-right: .125rem;
  font-size: .65rem;
  font-weight: 600;
  &.secondary{
    background-color: $colorful_buttons_background_secondary;
    color: $secondary_color;
    margin-right: 0;
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
    img{
      width: 6rem;
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
 // redeem__tip
}
.header__body{
  width: 33rem;
  min-height: 1.5rem;
  display: inline-block;
}
@media (min-width: 768px) {
  .header__body {
    width: 27rem;
  }
  .header .header__left_section{
    width: calc(50% - 13.5rem);
    padding-right: 0.5rem;
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
}

@media (min-width: 1200px) {
  .header .header__body {
    width: 35rem
  }
  .header .header__left_section{
    width: calc(50% - 17.7rem);
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
