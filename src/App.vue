<template>
  <div id="app" class="app-container">
    <app-header></app-header>
    <div class="clearfix">
      <div class="content-area float-left">
        <router-view></router-view>
      </div>
      <div class="articles-section float-left">
        <articles-section></articles-section>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNavigation from './components/layout/HeaderNavigation';
import ArticlesSection from './components/layout/articles/ArticlesSection';

export default {
  name: 'app',
  components: {
    appHeader: HeaderNavigation,
    articlesSection: ArticlesSection
  }
}
</script>

<style lang="scss">
  @import 'globalStyles/base.scss';
</style>
