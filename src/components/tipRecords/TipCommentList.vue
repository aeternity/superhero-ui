<template>
  <div class="tip-comment-list">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="tree"
    >
      <TipComment v-bind="comment" />
      <div
        v-if="comment.children && comment.children.length"
        class="child-comments"
      >
        <TipComment
          v-for="childComment in comment.children"
          :key="childComment.id"
          v-bind="childComment"
        />
        <SendComment
          :tip-id="comment.tipId"
          :parent-id="comment.id"
        />
      </div>
      <SendComment
        v-else
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

  .tip-comment {
    margin-bottom: 0;
  }

  .child-comments {
    border-top: 0.05rem solid $article_content_color;
    margin: 0 1rem;

    @include smallest {
      margin: 0 0.5rem;
    }

    & > * {
      margin-right: -1rem;
      margin-left: 2rem;

      @include smallest {
        margin-right: -0.5rem;
        margin-left: 1rem;
      }
    }
  }

  .send-comment {
    padding: 0 1rem 1rem 1rem;

    @include smallest {
      padding: 0 0.5rem 1rem 0.5rem;
    }
  }
}
</style>
