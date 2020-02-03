<template>
<div>
  <div class="articles__container pt-3 pl-3 pr-3">
    <div class="articles__title pb-1">Recommendations</div>
    <articles-section-item></articles-section-item>
    <articles-section-item></articles-section-item>
    <div class="articles__title pb-1">Creators I Follow</div>
    <articles-section-creators></articles-section-creators>
    <div class="articles__title pb-1">Saved Tags</div>
    <articles-section-tags></articles-section-tags>
  </div>
  <div class="articles__footer pl-3 pr-3 clearfix">
    <div class="hr"></div>
    <div class="float-left">&#9400; Raendom.com</div>
    <div class="float-right">
        <a class="ml-1">Terms</a>
        <a class="ml-1">Privacy Policy</a>
        <a class="ml-1">Cookies</a>
    </div>
  </div>
</div>

</template>

<script>
import ArticlesSectionItem from './ArticlesSectionItem';
import ArticlesSectionCreators from './ArticlesSectionCreators';
import ArticlesSectionTags from './ArticlesSectionTags';

export default {
  components: {
    articlesSectionItem: ArticlesSectionItem,
    articlesSectionCreators: ArticlesSectionCreators,
    articlesSectionTags: ArticlesSectionTags
  }
}
</script>

<style lang="scss" scoped>
@import "../../../globalStyles/variables";

.articles__container{
  background-color: $light_color;
  margin-bottom: -3rem;
  padding-bottom: 4rem;
  .articles__title{
    color: $standard_font_color;
    font-weight: 700;
  }
}

.articles__footer{
  font-size: .75rem;
  color: $light_font_color;
  .hr{
    border-top: .0875rem solid $light_font_color;
  }
  a{
    cursor: pointer;
  }
}
</style>