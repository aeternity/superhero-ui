<template>
  <div class="app__rightcolumn">
    <div class="content">
      <div class="section">
        <div class="section__title">
          Trending
        </div>
        <div class="section__body clearfix">
          <div class="float-left">#coronavirus</div>
          <div class="float-right">33K AE(~6.6K USD)</div>
        </div>
      </div>
      <div class="section">
        <div class="section__title">
          Famous Superheroes
        </div>
        <div class="section__body clearfix">
          <div class="float-left">#coronavirus</div>
          <div class="float-right">33K AE(~6.6K USD)</div>
        </div>
      </div>
      <div class="clearfix footer">
        <div class="float-left">&copy; 2020 SUPERHERO.com</div>
        <div class="float-right">
          <a>Terms</a>
          <a>Privacy Policy</a>
        </div>
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
  .content{
    width: 8.3rem;
    margin-top: 1rem;
    .section{
      border: .065rem solid $panel_border_color;
      margin-bottom: 1rem;
    }
    .section__title{
      text-transform: uppercase;
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
    .footer{
      font-size: .33rem;
      a{
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}

</style>
