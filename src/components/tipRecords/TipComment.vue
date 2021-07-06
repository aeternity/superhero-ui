<template>
  <div
    class="tip-comment"
    :class="{ clickable }"
    @click="clickable && $router.push({
      name: 'comment',
      params: { tipId, id },
    })"
  >
    <AuthorAndDate
      :date="createdAt"
      :address="author"
    />
    <div class="note">
      {{ text }}
    </div>
    <div class="actions">
      <TipInput
        :comment="{ tipId, id }"
        @click.native.stop
      />
      <ButtonPlain
        class="comments-count"
        :title="$t('components.tipRecords.TipComment.Replies')"
        @click.stop="$emit('reply')"
      >
        <IconReply /> <span>{{ children.length }}</span>
      </ButtonPlain>
    </div>
  </div>
</template>

<script>
import TipInput from '../TipInput.vue';
import AuthorAndDate from './AuthorAndDate.vue';
import ButtonPlain from '../ButtonPlain.vue';
import IconReply from '../../assets/iconReply.svg?icon-component';

export default {
  components: {
    TipInput,
    AuthorAndDate,
    ButtonPlain,
    IconReply,
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
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: $light_color;

  @include smallest {
    padding: 0.5rem;
  }

  &.clickable:hover {
    cursor: pointer;
  }

  .author-and-date {
    padding-bottom: 0;

    ::v-deep .address {
      font-size: 0.6rem;
    }
  }

  .note {
    padding: 0.35rem 0 0.25rem 0;
    line-height: 1.1rem;
    color: $comment_text_color;
    font-size: 0.7rem;
    font-weight: 400;

    @include smallest {
      padding: 0.25rem 0 0 0;
    }
  }

  .actions {
    padding-top: 0.25rem;
    color: $standard_font_color;
    font-size: 0.8rem;
    display: flex;

    @include smallest {
      padding-left: 0;
      padding-top: 0.5rem;
    }

    .comments-count {
      &:hover svg {
        transition: color 0.3s;
        color: $standard_font_color;
      }

      svg {
        color: $search_nav_border_color;
        height: 14px;
      }

      svg,
      span {
        vertical-align: middle;
      }

      span {
        color: $standard_font_color;
      }
    }

    > :not(:first-child) {
      margin-left: 3rem;
    }
  }
}
</style>
