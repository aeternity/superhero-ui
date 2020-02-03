<template>
  <div class="articles__creators p-3 mb-3">
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
    <div class="creator__avatar pr-3" title="hellodolly.chain">
      <img src="../../../resources/images/userLogo.png">
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>
@import "../../../globalStyles/variables";

.articles__creators{
  background-color: $article_content_color;
  .creator__avatar{
    display: inline-block;
    cursor: pointer;
    img{
      width: $avatar_image_width;
      border-radius: $avatar_image_radius;
      background-color: $light_color;      
    }
  }
}
</style>