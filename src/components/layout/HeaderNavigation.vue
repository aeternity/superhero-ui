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
        <li class="ml-5">
          <button class="btn btn-light mr-2 mt-1">Claim Tips</button>
          <button class="btn btn-light mr-2 mt-1">Send Tips</button>
          <button class="btn btn-light mt-1">Add Tokens</button>
        </li>
      </ul>
      <div class="user__container">
        <div class="user__info mr-2">
          <i class="far fa-question-circle"></i>
        </div>
        <div class="user__notifications mr-2">
          <span>99</span>
          <i class="fa fa-bell"></i>
        </div>
        <div class="user__avatar">
          <img src="../../resources/images/user.png">
          <span>Major Tom</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "../../globalStyles/variables";
@import "../../globalStyles/mixins";

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
    min-height: 3.125rem;
    .nav-link {
      color: $primary_color;
      height: 100%;
      span{
        font-size: .75rem;
        vertical-align: sub;
      }
      &:hover, &:focus {
        color: rgba( $primary_color, .8 )
      }
    }
    .nav-item.active .nav-link{
      color: $secondary_color;
      box-sizing: border-box;
      border-bottom: .125rem solid $secondary_color;
    }
    .btn.btn-light{
      position: relative;
      top: 45%;
      transform: translateY(-50%);
    }
  } 
  .user__notifications{
    position: relative;
    span{
      position: absolute;
      width: .8rem;
      height: .8rem;
      text-align: center;
      background-color: $secondary_color;  
      border-radius: .8rem;
      font-size: .6rem;
      color: #fff;
      top: .3rem;
      left: -.5rem;
      z-index: 1;
    }
  }
  .user__avatar{
    display: inline-block;
    line-height: .5rem;
    padding-top: .125rem;
    img{
      margin: 0 auto;
      width: 2rem;
      border-radius: 2rem;
      background-color: $light_color;
      display: block
    }
    span{
      font-size: .6125rem;
      color: $primary_color;
    }
  } 
  .user__info,.user__notifications{
    display: inline-block;
  }
  .user__notifications,.user__info{ 
    @include vertical-align();
    i { 
      font-size: 1.2rem;
      color: $primary_color;
    }
    &:hover{
      cursor: pointer;
      opacity: .8;
    }
  }

}
</style>