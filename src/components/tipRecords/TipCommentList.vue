<template>
  <div class="tip-comment-list">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="tree"
    >
      <TipComment v-bind="comment" />
      <TipComment
        v-for="childComment in comment.children || []"
        :key="childComment.id"
        v-bind="childComment"
      />
      <SendComment
        :tip-id="comment.tipId"
        :parent-id="comment.id"
      />
    </div>
  </div>
</template>

<script>
import TipComment from './TipComment.vue';
import SendComment from '../SendComment.vue';

export default {
  components: {
    TipComment,
    SendComment,
  },
  props: {
    comments: { type: Array, required: true },
  },
};
</script>

<style lang="scss" scoped>
.tip-comment-list .tree {
  background-color: $light_color;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem;

  @include smallest {
    padding: 0.5rem;
  }

  .tip-comment {
    margin-bottom: 0;
    padding-left: 0;
    padding-right: 0;

    &:first-child {
      padding-top: 0;
    }

    &:nth-child(2) {
      border-top: 0.05rem solid $article_content_color;
      border-radius: 0;
    }

    + .tip-comment,
    + .tip-comment + .send-comment {
      padding-left: 3rem;

      @include smallest {
        padding-left: 1.5rem;
      }
    }
  }
}
</style>
