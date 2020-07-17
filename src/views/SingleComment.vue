<template>
  <Page back>
    <div class="comment__page">
      <div
        v-if="comment"
        class="tipped__url"
      >
        <TipComment :comment="comment" />
      </div>
      <div class="comment__section">
        <p class="latest__comments">
          {{ $t('views.TipCommentsView.LatestReplies') }}
        </p>
        <SendComment
          :tip-id="tipId"
          :parent-id="id"
        />
      </div>
      <div
        v-if="comment"
        class="comments__section"
      >
        <Loading
          v-if="showLoading"
          class="loading-position-absolute"
        />
        <div
          v-if="comment.children.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="{ error }"
        >
          {{ $t('views.SingleCommentView.NoResultsMsg') }}
        </div>

        <TipComment
          v-for="nestedComment in comment.children"
          :key="nestedComment.id"
          :comment="nestedComment"
        />
      </div>
    </div>
  </Page>
</template>

<script>
import TipComment from '../components/tipRecords/TipComment.vue';
import Page from '../components/layout/Page.vue';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import SendComment from '../components/SendComment.vue';

export default {
  components: {
    Page,
    Loading,
    TipComment,
    SendComment,
  },
  props: {
    id: { type: [String, Number], required: true },
    tipId: { type: [String, Number], required: true },
  },
  data: () => ({
    showLoading: true,
    error: false,
  }),
  computed: {
    comment() {
      return this.$store.state.backend.comment[this.id];
    },
  },
  mounted() {
    const handler = () => this.reloadComment();
    this.$watch(({ id }) => id, handler, { immediate: true });
    EventBus.$on('reloadData', handler);
    const interval = setInterval(handler, 120 * 1000);

    this.$once('hook:destroyed', () => {
      EventBus.$off('reloadData', handler);
      clearInterval(interval);
    });
  },
  methods: {
    async reloadComment() {
      this.showLoading = true;
      try {
        await this.$store.dispatch('backend/reloadComment', this.id);
      } catch (error) {
        this.error = true;
        throw error;
      } finally {
        this.showLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.comment__page .tipped__url {
  .tip__record.row {
    background-color: $light_color;
    border-radius: 0;
  }

  .comment .tip__body .tip__note {
    overflow: visible;
    display: block;
  }
}
</style>
