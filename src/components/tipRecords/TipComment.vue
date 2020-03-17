<template>
    <div class="tip__record row position-relative comment">
      <div class="tip__body">
        <div class="clearfix">
          <div class="tip__author" :title="comment.author">
            <router-link :to="'/user-profile/' + comment.author">
              <img src="../../assets/userAvatar.svg">
              <span class="chain__name" v-if="userChainNames && userChainNames.length > 0" :title="userChainNames[0].name" >{{userChainNames[0].name}}</span>
              <span class="chain__name" v-else-if="comment.chainNames && comment.chainNames.length > 0" :title="comment.chainNames[0].name">{{comment.chainNames[0].name}}</span>
              <span v-else :address="comment.author" class="address">{{comment.author}}</span>
            </router-link>
            <span class="date"
             v-bind:class="[!(comment.chainNames && comment.chainNames.length > 0) && !(userChainNames && userChainNames.length > 0)? 'wholeaddr': '']">
              {{ new Date(comment.createdAt).toLocaleString('en-US', { hourCycle: 'h24' }) }}
            </span>
          </div>
        </div>
          <div class="tip__note pr-2" :title="comment.text">
              {{ comment.text }}
          </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'TipComment',
    props: ['comment', 'userChainNames'],
    data() {
      return {
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../styles/base";
  .comment.tip__record{
    padding-bottom: 0;
    margin-bottom: .5rem;
    border-radius: .5rem;
  }
  .tip__record .tip__body .tip__note{
    padding: .5rem 1rem .5rem 1rem;
    color: $comment_text_color;
  }
  .tip__record{
    background-color: $light_color;
  }
  .tip__record .tip__body .tip__note{
    height: initial;
  }
@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .comment.tip__record{
      padding-bottom: 0;
      padding-top: 1rem;
      .tip__body{
        padding-left: 0;
        .tip__note{
          padding-bottom: 0;
        }
      }
    }

  }
</style>
