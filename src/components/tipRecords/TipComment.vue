<template>
  <div
    class="row position-relative tip-comment"
    :class="{ clickable }"
    @click="clickable && $router.push({
      name: 'comment',
      params: { tipId: comment.tipId, id: comment.id },
    })"
  >
    <div class="body">
      <AuthorAndDate
        :date="comment.createdAt"
        :address="comment.author"
      />
      <div class="note">
        {{ comment.text }}
      </div>
      <div class="actions">
        <span @click.stop>
          <TipInput :comment="comment" />
        </span>
        <span
          :title="$t('components.tipRecords.TipComment.Replies')"
          class="comments"
        >
          <img src="../../assets/iconReply.svg">
          &nbsp;<span>{{ childComments }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TipInput from '../TipInput.vue';
import AuthorAndDate from './AuthorAndDate.vue';

export default {
  components: {
    TipInput,
    AuthorAndDate,
  },
  props: {
    comment: { type: Object, required: true },
  },
  computed: {
    ...mapState(['chainNames']),
    userChainName() {
      return this.chainNames[this.comment.author];
    },
    childComments() {
      if (this.comment && this.comment.children) {
        return this.comment.children.length;
      }
      return 0;
    },
    clickable() {
      return this.$route.name !== 'comment' || +this.$route.params.id !== +this.comment.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-comment {
  margin: 0 0 0.5rem 0;
  padding-bottom: 0;
  border-radius: 0.5rem;
  background-color: $light_color;

  &.clickable:hover {
    cursor: pointer;
  }

  .body {
    padding-top: 1rem;
    width: 100%;

    .author-and-date {
      padding-bottom: 0;

      ::v-deep .address {
        font-size: 0.6rem;
      }
    }

    .note {
      padding: 0.35rem 1rem 0.25rem 1rem;
      line-height: 1.1rem;
      color: $comment_text_color;
      height: initial;
      font-size: 0.7rem;
      font-weight: 400;
      margin: 0;
    }

    .actions {
      padding: 0.25rem 1rem 1rem 1rem;
      color: $standard_font_color;
      font-size: 0.8rem;
      display: flex;
      align-items: center;

      img {
        height: 0.7rem;
      }
    }

    .comments {
      margin-left: 3rem;

      > * {
        vertical-align: middle;
      }
    }
  }
}

@include smallest {
  .tip-comment {
    padding: 0.5rem;

    .body {
      padding-left: 0;

      .note {
        margin-top: 0.25rem;
        margin-bottom: 0;
        padding: 0;
      }

      .actions {
        padding-left: 0;
        padding-top: 0.5rem;
      }
    }
  }
}
</style>
