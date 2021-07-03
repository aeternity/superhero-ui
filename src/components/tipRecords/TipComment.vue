<template>
  <div
    class="tip-comment"
    :class="{ detailed }"
    @click="!detailed && $router.push({
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
      <ButtonFeed
        :title="$t('components.tipRecords.TipComment.Replies')"
        :disabled="detailed"
        @click="replyClickHandler"
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
  methods: {
    replyClickHandler(event) {
      if (!this.$listeners.reply) return;
      this.$emit('reply');
      event.stopPropagation();
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

  &:not(.detailed):hover {
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

    > :not(:first-child) {
      margin-left: 3rem;
    }
  }
}
</style>
