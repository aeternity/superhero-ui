<template>
  <div class="app__rightcolumn">
    <div class="navigation">
      <div class="section__title">
        Trending
      </div>
      <div class="section__body clearfix">
        <div class="float-left">#coronavirus</div>
        <div class="float-right">33K AE(~6.6K USD)</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightSectionComponent',
    data() {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/base";
.app__rightcolumn{
  color: white;
  display: inline-block;
  font-size: .55rem;
  position: fixed;
  right: 0;
  .navigation{
    width: 8rem;
    margin-top: 1rem;
    text-transform: uppercase;
    .section__title{
      background-color: $actions_ribbon_background_color;
      border-top-right-radius: .25rem;
      border-top-left-radius: .25rem;
      padding: .5rem;
    }
    .section__body{
      text-transform: none;
      font-size: .45rem;
      padding: .5rem;
    }
  }
}

</style>
