<template>
  <nav class="navbar navbar-expand-lg navbar-light ">
    <router-link class="navbar-brand" to="">Brand</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto">
        <router-link class="nav-item" tag="li" active-class="active" to="/" exact>
          <a class="nav-link">
            <span>Home</span>
          </a>
        </router-link>
        <router-link class="nav-item" tag="li" active-class="active" to="/test">
          <a class="nav-link">
            <span>Blockchain</span>
          </a>
        </router-link>
        <router-link class="nav-item" tag="li" active-class="active" to="/test1">
          <a class="nav-link">
            <span>Gaming</span>
          </a>
        </router-link>
        <router-link class="nav-item" tag="li" active-class="active" to="/test2">
          <a class="nav-link">
            <span>Pricing</span>
          </a>
        </router-link>
      </ul>
      <span class="navbar-text">
        Navbar text with an inline element
      </span>
    </div>
  </nav>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "../../globalStyles/variables";

.navbar{
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  padding: 0 5vw;
  background-color: #fff;
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  .navbar-nav{
    .nav-link {
      color: $secondary_color;
      span{
        font-size: .75rem;
      }
      &:hover, &:focus {
        color: rgba( $secondary_color, .8 )
      }
    }
    .nav-item.active .nav-link{
      color: $primary_color;
      box-sizing: border-box;
      border-bottom: .125rem solid $primary_color;
    }
  } 
}
</style>