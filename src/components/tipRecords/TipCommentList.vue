<template>
  <div
    v-if="!comment.parentId"
    class="comment-list"
  >
    <TipComment :comment="comment" />
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

@include smallest {
  .child-comments {
    margin: 0 0.5rem;

    & > div {
      margin-right: -0.5rem;
      margin-left: 1rem;
    }
  }

  .send-comment {
    padding: 0 0.5rem 1rem 0.5rem;
  }
}
</style>
