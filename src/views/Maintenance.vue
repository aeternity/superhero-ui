<template>
  <div>
    <div class="container wrapper mt-2">
      <div class="p-5 content text-center">
        <img alt src="../assets/headerLogo.svg" />
        <div class="mt-5">
          <div class="maintenance-alert">
            <h4 class="alert-heading">Oops!</h4>
            <p>Superhero is Superpowering.</p>
            <p> Hey, we're humans too. BRB. </p>
            <hr />
            <router-link :to="{ name: 'home' }">
              <span>Proceed to home page</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Maintenance',
};
</script>


<style lang="scss" scoped>
.maintenance-alert {
  padding: 3rem;
  color: $standard_font_color;
  background-color: $light_color;
  border-color: $light_color;

  p {
    color: #ccc;
  }

  hr {
    border-color: #ccc;
  }

  .alert-heading {
    color: $secondary_color;
  }

  .router-link-active {
    color: $custom_links_color;
  }
}
</style>
