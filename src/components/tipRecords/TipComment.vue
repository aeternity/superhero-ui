<template>
  <div
    class="row position-relative tip-comment"
    :class="{ clickable }"
    @click="clickable && $router.push({
      name: 'comment',
      params: { tipId, id },
    })"
  >
    <div class="body">
      <AuthorAndDate
        :date="createdAt"
        :address="author"
      />
      <div class="note">
        {{ text }}
      </div>
      <div class="actions">
        <span @click.stop>
          <TipInput :comment="{ tipId, id }" />
        </span>
        <span
          :title="$t('components.tipRecords.TipComment.Replies')"
          class="comments"
        >
          <img src="../../assets/iconReply.svg">
          &nbsp;<span>{{ children.length }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import TipInput from '../TipInput.vue';
import AuthorAndDate from './AuthorAndDate.vue';

export default {
  components: {
    TipInput,
    AuthorAndDate,
  },
  inheritAttrs: false,
  props: {
    tipId: { type: String, required: true },
    id: { type: Number, required: true },
    author: { type: String, required: true },
    text: { type: String, required: true },
    children: { type: Array, default: () => [] },
    createdAt: { type: String, required: true },
  },
  computed: {
    clickable() {
      return this.$route.name !== 'comment' || +this.$route.params.id !== +this.id;
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
