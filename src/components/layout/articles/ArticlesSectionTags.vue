<template>
  <div class="articles__tags p-3">
    <a class="mr-1">#HelloDolly</a>
    <a class="mr-1">#GlobalWarming</a>
    <a class="mr-1">#CoronaVirus</a>
    <a class="mr-1">#Rock&Roll</a>
    <a class="mr-1">#Blockchain</a>
    <a class="mr-1">#tokens</a>
    <a class="mr-1">#tokenomics</a>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>
@import "../../../globalStyles/variables";

.articles__tags{
  background-color: $article_content_color;
  a{
    font-size: .75rem;
    color: $primary_color;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>