<template>
    <div class="tip__record row position-relative comment">
      <div class="tip__body">
        <div class="clearfix">
          <div class="tip__author" :title="comment.author">
            <router-link :to="'/user-profile/' + comment.author">
              <img :src="getAvatar(comment.author)">
              <span class="chain__name" v-if="userChainName">{{userChainName}}</span>
              <span class="chain__name" v-else-if="comment.chainName">{{comment.chainName}}</span>
              <span v-else :address="comment.author" class="address">{{comment.author}}</span>
            </router-link>
            <span class="date"
             v-bind:class="[userChainName || comment.chainName ? '': 'wholeaddr']">
              <format-date :dateTimestamp="comment.createdAt"></format-date>
            </span>
          </div>
        </div>
          <div class="tip__note" :title="comment.text">
              {{ comment.text }}
          </div>
      </div>
    </div>
</template>

<script>

import FormatDate from './FormatDate.vue';
import Backend from '../../utils/backend';

export default {
  name: 'TipComment',
  props: ['comment', 'userChainName'],
  data() {
    return {
    };
  },
  components: {
    FormatDate,
  },
  methods: {
    getAvatar(address) {
      return Backend.getProfileImageUrl(address);
    },
  },
};
</script>


<style lang="scss" scoped>
  .comment.tip__record{
    padding-bottom: 0;
    margin-bottom: .5rem;
    border-radius: .5rem;
    background-color: $light_color;
    .tip__body .tip__note{
      padding: .5rem 1rem .5rem 1rem;
      color: $comment_text_color;
      height: initial;
      font-size: .7rem;
      font-weight: 400;
    }
  }

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .comment.tip__record{
      padding-bottom: 0;
      padding: .5rem;
      .tip__body{
        padding-left: 0;
        .tip__note{
          margin-top: .25rem;
          margin-bottom: 0;
          padding: 0;
        }
      }
    }

  }
</style>
