<template>
  <div class="loader">
    <div class="flex justify-center">
      <ae-loader class="ae-loader-scaling"></ae-loader>
      <div class="ae-loader-progress">{{progress}}</div>
    </div>
  </div>
</template>

<script>
    import {AeLoader} from '@aeternity/aepp-components'

    export default {
        name: "BiggerLoader",
        components: {AeLoader},
        props: ['progress']
    }
</script>

<style scoped>
  .loader {
    position: absolute;
  }

  .ae-loader-progress {
    font-size: 1.6em;
    margin-top: 0.8em;
    text-align: center;
    font-weight: 700;
  }

  .ae-loader-scaling {
    width: 5em !important;
    height: 5em !important;
    border-radius: 5em !important;
    border-width: 0.4em !important;
  }
</style>
