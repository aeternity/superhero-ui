<template>
  <div
    class="tip-comment"
    :class="{ detailed }"
  >
    <RouterLink
      v-if="!detailed"
      :to="{ name: 'comment', params: { tipId, id } }"
    />
    <AuthorAndDate
      :date="createdAt"
      :address="author"
    />
    <div class="note">
      {{ text }}
    </div>
    <div class="actions">
      <TipInput :comment="{ tipId, id }" />
      <ButtonFeed
        :title="$t('components.tipRecords.TipComment.Replies')"
        :disabled="detailed || !$listeners.reply"
        @click="$listeners.reply && $emit('reply')"
      >
        <IconReply slot="icon" />
        {{ children.length }}
      </ButtonFeed>
    </div>
  </div>
</template>

<script>
import TipInput from '../TipInput.vue';
import AuthorAndDate from './AuthorAndDate.vue';
import ButtonFeed from '../ButtonFeed.vue';
import IconReply from '../../assets/iconReply.svg?icon-component';

export default {
  components: {
    TipInput,
    AuthorAndDate,
    ButtonFeed,
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
    detailed: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.tip-comment {
  margin-bottom: 0.5rem;
  padding: 1rem;
  position: relative;

  @include smallest {
    padding: 0.5rem;
  }

  a::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .author-and-date {
    padding-bottom: 0;

    ::v-deep .author {
      position: relative;
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
    display: flex;

    @include smallest {
      padding-top: 0.5rem;
    }

    > :not(:first-child) {
      margin-left: 3rem;
    }

    .tip-input,
    .button-feed:not([disabled]) {
      position: relative;
    }
  }
}
</style>
