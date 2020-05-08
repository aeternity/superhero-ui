<template>
  <div
    class="comment-list"
  >
    <TipComment
      :comment="comment"
    />
    <div
      v-if="childComments.length"
      class="child-comments"
    >
      <TipComment
        v-for="childComment in childComments"
        :key="childComment.id"
        :comment="childComment"
      />
      <SendComment
        :tip-id="comment.tipId"
        :parent-id="comment.id"
        class="send-comment"
      />
    </div>
    <SendComment
      v-if="!childComments.length"
      :tip-id="comment.tipId"
      :parent-id="comment.id"
      class="send-comment"
    />
  </div>
</template>

<script>
import TipComment from './TipComment.vue';
import SendComment from '../SendComment.vue';

export default {
  name: 'TipCommentList',
  components: {
    TipComment,
    SendComment,
  },
  props: {
    comment: { type: Object, required: true },
    userChainName: { type: String, default: '' },
  },
  computed: {
    childComments() {
      return this.comment.children || 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-list {
  background-color: $light_color;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;

  .tip__record.comment {
    margin-bottom: 0;
  }
}

.child-comments {
  border-top: 0.05rem solid $article_content_color;
  margin: 0 1rem;

  & > div {
    margin-right: -1rem;
    margin-left: 2rem;
  }
}

.send-comment {
  padding: 0 1rem 1rem 1rem;
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .child-comments {
    margin: 0 0.5rem;

    & > div {
      margin-right: -0.5rem;
      margin-left: 1rem;
    }
  }
}
</style>
