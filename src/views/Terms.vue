<template>
  <div>
    <header-component></header-component>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper">
      <h1>Terms</h1>  
    </div>
  </div>
</template>

<script>

  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'Terms',
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters(['account', 'balance', 'isLoggedIn', 'current']),
    },
    methods: {
    },
    components: {
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
    },
    async created() {
      
    },
  }
</script>


<style lang="scss" scoped>
  @import "../styles/base";

  .header{
    h2{
      color: $standard_font_color;
    }
    p{
      color: $light_font_color;
    }
    a{
      color: $custom_links_color;
    }
  }
  .search-icon {
    height: 1rem;
  }

  .spinner__container{
    margin-top: 1rem;
    margin-bottom: 1rem;
    max-height: 200px;
    opacity: 100%;
    transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
    position: fixed;
    left: 50%;
    transform: translate( -50%);
    z-index: 3;
    &.active {
      max-height: 0;
      opacity: 0;
    }
  }
  .container.wrapper{
    min-height: 4rem;
  }
   .actions__container{
     font-size: .75rem;
      background-color: $background_color;
     .container{
       padding: 0;
     }
      .row{
        background-color: $actions_ribbon_background_color;
        border-top-right-radius: .25rem;
        border-top-left-radius: .25rem;
        margin: 0;
      }
      .sorting{
        border-radius: .25rem;
        text-align: left;
        padding-left: 1rem;
        a{
          display: inline-block;
          padding: .45rem .45rem .45rem .45rem;
          color: $light_font_color;
          &:last-child{
            margin-right: 0;
          }
          &:hover{
            color: $primary_color;
            cursor: pointer;
          }
        }
        a.active{
          color: $custom_links_color;
          border-bottom: .065rem solid $custom_links_color;
        }
      }
    }
  .tips__container{
    width: 100%;
    background-color: $tip_list_background_color;
    padding-top: 0.1rem;
    &:empty{
      visibility: hidden;
    }
  }

  .no-results{
    color: $standard_font_color;
    font-size: .75rem;
    margin-bottom: 4rem;
  }

  .tip__post {
    background-color: #272830;
    padding: 1rem;
    form {
      span.append__ae {
        font-size: 0.75rem;
        background: $background_color;
        color: $secondary_color;
        cursor: default;
        &:hover {
          background: $background_color;
          cursor: default;
        }
      }
      .tip__post__label {
        font-weight: 600;
        color: white;
      }
      .form-group {
        margin-bottom: 0;
        input {
          background-color: $background_color;
          color: #FFF;
          font-size: .75rem;
          border: 1px solid #21212A;
        }
      }
      .tip__post__balance {
        span {
          font-size: 0.75rem;
          color: white;
        }
      }
      .tip__send {
        padding-left: 3rem;
        padding-right: 3rem;
        color: white;
        background-color: $custom_links_color
      }
    }
  }

@media only screen and (max-width: 768px){
  .actions__container .input-group{
    margin-bottom: 1rem;
    padding-right: 0;
  }
  .actions__container{
    padding-bottom: 0;
    .input-group{
      margin-bottom: 0;
    }
  }
}

@media only screen and (max-width: 600px) {
  .actions__container .input-group{
    margin-bottom: 1rem;
    padding-right: 0;
  }
  .actions__container{
    padding-bottom: 0;
    .input-group{
      margin-bottom: 0;
    }
  }
}

//Smallest devices Portrait and Landscape
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {

  .actions__container{
      width: 100%;
      padding-top: .5rem;
      background-color: $actions_ribbon_background_color;
      overflow-x: hidden;
      z-index: 10;
      .container,.row{
        padding: 0;
      }
      .sorting{
        width: -webkit-fill-available;
        width: -moz-available;
        background-color: #1D1D23;
        margin: .5rem -1rem 0 -1rem;
        text-align: center;
        padding-bottom: 0;
        padding-left: .5rem;
        border-bottom: .075rem solid $search_nav_border_color;
        a{
          cursor: pointer;
          width: 32.5%;
          display: inline-block;
          padding-bottom: .45rem;
          margin-right: 0;
          &.active{
            border-bottom: .075rem solid $custom_links_color;
            margin-bottom: -.075rem;
          }
        }
      }
    }
  .container.wrapper{
    padding: 1rem .25rem 0 .25rem;
    .tips__container{
      padding: 0;
      background-color: $background_color;
    }
  }

}
</style>
