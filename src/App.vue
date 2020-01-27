<template>
  <div id="app" class="app-container">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderNavigation from './components/layout/HeaderNavigation'

export default {
  name: 'app',
  components: {
    appHeader: HeaderNavigation
  }
}
</script>

<style lang="scss">
  @import 'globalStyles/base.scss';
</style>
