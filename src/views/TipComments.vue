<template>
  <Page back>
    <div class="url__page">
      <div
        v-if="tip"
        class="tipped__url"
      >
        <TipRecord :tip="tip" />
      </div>
      <div
        v-if="tip"
        class="comment__section"
      >
        <p class="latest__comments">
          {{ $t('views.TipCommentsView.LatestReplies') }}
        </p>
        <SendComment :tip-id="tip.id" />
      </div>
      <div class="comments__section">
        <Loading
          v-if="showLoading"
          :above-content="!!(tip && tip.comments.length)"
        />
        <template v-if="tip">
          <div
            v-if="tip.comments.length === 0 && !showLoading"
            class="no-results text-center w-100"
            :class="[error ? 'error' : '']"
          >
            {{ $t('views.TipCommentsView.NoResultsMsg') }}
          </div>

          <TipCommentList
            v-for="(comment, index) in tip.comments"
            :key="index"
            :comment="comment"
          />
        </template>
      </div>
    </div>
    <SuccessModal
      v-if="showSuccessModal"
      :title="$t('components.tipRecords.TipRecord.reportPostTitle')"
      :body="$t('components.tipRecords.TipRecord.reportPostBody')"
      @close="showSuccessModal = false"
    />
  </Page>
</template>

<script>
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipCommentList from '../components/tipRecords/TipCommentList.vue';
import Page from '../components/layout/Page.vue';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import backendAuthMixin from '../utils/backendAuthMixin';
import SendComment from '../components/SendComment.vue';
import SuccessModal from '../components/SuccessModal.vue';

export default {
  mixins: [backendAuthMixin()],
  components: {
    Loading,
    TipRecord,
    TipCommentList,
    Page,
    SendComment,
    SuccessModal,
  },
  props: {
    id: { type: [String, Number], required: true },
  },
  data: () => ({
    showLoading: false,
    error: false,
    showSuccessModal: false,
  }),
  computed: {
    tip() {
      return this.$store.state.backend.tip[this.id];
    },
  },
  async mounted() {
    const handler = () => this.reloadTip();
    this.$watch(({ id }) => id, handler, { immediate: true });
    EventBus.$on('reloadData', handler);
    const interval = setInterval(handler, 120 * 1000);

    this.$once('hook:destroyed', () => {
      EventBus.$off('reloadData', handler);
      clearInterval(interval);
    });
  },
  methods: {
    async handleBackendSucceedCall(methodName) {
      switch (methodName) {
        case 'unPinItem':
        case 'pinItem':
          await this.$store.dispatch('updatePinnedItems');
          break;
        case 'sendPostReport':
          this.showSuccessModal = true;
          break;
        default:
      }
    },
    async reloadTip() {
      this.showLoading = true;
      try {
        await this.$store.dispatch('backend/reloadTip', this.id);
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
.url__page,
.comment__page {
  color: $light_font_color;
  font-size: 0.75rem;

  .avatar,
  .user-identicon svg {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }

  .tipped__url .tip__record {
    margin-bottom: 0;

    &.row {
      background-color: $thumbnail_background_color;
    }
  }

  .tip__article {
    background-color: $thumbnail_background_color_alt;

    .preview__image {
      background-color: $thumbnail_background_color_alt;
    }

    &:hover {
      background-color: #373843;

      .preview__image {
        background-color: #373843;
      }
    }
  }

  .comments__section {
    background-color: $thumbnail_background_color;
    padding: 1rem;
    position: relative;
  }

  .no-results {
    color: $standard_font_color;
    font-size: 0.75rem;
    text-align: center;

    &.error {
      color: $red_color;
    }
  }

  .comment__section {
    background-color: $thumbnail_background_color;
    padding: 0.75rem 1rem 0 1rem;

    p {
      font-size: 0.75rem;
      text-transform: capitalize;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 600;
    }
  }
}
</style>
