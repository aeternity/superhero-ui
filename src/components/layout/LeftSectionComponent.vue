<template>
  <div class="app__leftcolumn">
    <div class="navigation">
      <div><a>Home</a></div>
      <div><a>Trending</a></div>
      <div><a>Mission</a></div>
      <div><a>Create Profile</a></div>
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
  .navigation{
    width: 6rem;
    margin-top: 1rem;
    display: inline-block;
    width: 6rem;
    text-transform: uppercase;
    text-align: left;
  }
}

</style>
