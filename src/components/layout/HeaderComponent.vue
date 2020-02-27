<template>
  <div class="header">
    <div class="header__logo">
      <img src="../../assets/headerLogo.svg">
    </div>
    <div class="header__body">
      <slot></slot>
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

.header{
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  font-size: .75rem;
  margin: 0 1rem 0 0;
  background-color: $actions_ribbon_background_color;
  min-height: 3rem;
  .header__logo{
    width: calc(50% - 17.5rem);
    display: inline-block;
    text-align: right;
    img{
      width: 6rem;
    }
  }
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
  .header .header__logo{
    width: calc(50% - 13.5rem)
  }
}

@media (min-width: 992px) {
  .header .header__body {
    width: 33rem
  }
  .header .header__logo{
    width: calc(50% - 17.5rem)
  }
}

@media (min-width: 1200px) {
  .header .header__body {
    width: 33rem
  }
  .header .header__logo{
    width: calc(50% - 17.5rem)
  }
}

@media only screen and (max-width: 768px) {
  .header .header__body {
    width: 100%;
  }
 .header .header__logo {
    display: none;
  }
}

</style>
