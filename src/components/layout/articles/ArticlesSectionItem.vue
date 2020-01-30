<template>
    <div class="pl-4 pr-4 pt-3 pb-2 articles__row mb-3">
      <div class="articles__tag pl-1 pr-1">BlockChain</div>
      <div class="d-inline-block article__item mr-3">
        <div class="article__image-container">
          <img src="https://via.placeholder.com/90x55">
          <div class="pr-1 pl-1 article__tokens-count">+ 700 AE</div>
        </div>
        <div class="mt-1 mb-1">
          <i class="fas fa-heart"></i><span class="article-likes__counter"> 10k</span>
          <i class="far fa-comment-dots"></i><span class="article-comments__counter"> 23k</span>
          <i class="fab fa-facebook"></i>
        </div>
        <div class="truncate-overflow article__caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
      </div>
      <div class="d-inline-block article__item mr-3">
        <div class="article__image-container">
          <img src="https://via.placeholder.com/90x55">
          <div class="pr-1 pl-1 article__tokens-count">+ 700 AE</div>
        </div>
        <div class="mt-1 mb-1">
          <i class="fas fa-heart"></i><span class="article-likes__counter"> 10k</span>
          <i class="far fa-comment-dots"></i><span class="article-comments__counter"> 23k</span>
          <i class="fab fa-facebook"></i>
        </div>
        <div class="truncate-overflow article__caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
      </div>
      <div class="d-inline-block article__item">
        <div class="article__image-container">
          <img src="https://via.placeholder.com/90x55">
          <div class="pr-1 pl-1 article__tokens-count">+ 700 AE</div>
        </div>
        <div class="mt-1 mb-1">
          <i class="fas fa-heart"></i><span class="article-likes__counter"> 10k</span>
          <i class="far fa-comment-dots"></i><span class="article-comments__counter"> 23k</span>
          <i class="fab fa-facebook"></i>
        </div>
        <div class="truncate-overflow article__caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
      </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "../../../globalStyles/variables";

.articles__row{
  background-color: $article_content_color;
  font-size: .75rem;
  border-radius: .25rem;
  position: relative;
  .articles__tag{
    position: absolute;
    top: 0;
    left: 0;
    border-radius: .1rem;
    color: $primary_color;
    border: 0.075rem solid $primary_color;
    z-index: 1;
    background-color: $article_content_color;
    padding-top: .125rem;
    padding-bottom: .125rem;
    font-size: .625rem;
    font-weight: 700;
  }
  .article__item{
    width: $article_image_width;
    .article__image-container{
      position: relative;
      .article__tokens-count{
        color: $secondary_color;
        background-color: $article_content_color;
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: .5rem;
        padding-top: .125rem;
        padding-bottom: .125rem;
        border-top-right-radius: .1rem;
      }
    }
    .article__image-container, img{
      width: $article_image_width;
      height: $article_image_height;
      border-radius: .25rem;
    }
    .fas.fa-heart{
      color: $secondary_color
    }
    .article__caption{
      color: $primary_color;
      font-weight: 700;
      height: 3.5rem;
    }
  }
}

</style>