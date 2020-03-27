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
            <span class="tip__date">
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
import defaultAvatar from '../../assets/userAvatar.svg';

export default {
  name: 'TipComment',
  props: ['comment', 'userChainName'],
  data() {
    return {
      defaultAvatar,
    };
  },
  components: {
    FormatDate,
  },
  methods: {
    getAvatar(address) {
      const userImage = Backend.getProfileImageUrl(address);
      return userImage || this.defaultAvatar;
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

  .tip__author {
    align-items: center;
    color: $light_font_color;
    display: flex;
    font-size: .8rem;
    justify-content: space-between;

    .tip__date {
      display: inline-block;
      font-size: .6rem;
      text-align: right;
    }

    .address {
      font-size: .6rem;
    }

    .address,
    .chain__name {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      word-break: break-all;
    }

    img {
      border-radius: 50%;
      flex-shrink: 0;
      height: 2rem;
      margin-right: 0.25rem;
      object-fit: cover;
      width: 2rem;
    }

    a {
      align-items: center;
      color: $light_font_color;
      display: flex;
      margin-right: 1rem;
      overflow: hidden;

      &:hover {
        filter: brightness(1.3);
      }
    }

    .chain__name {
      color: #fff;
    }

    .tip__author_name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      width: 100%;
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
