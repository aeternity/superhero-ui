<template>
  <div>
    <MobileNavigation />
    <RightSection />
    <LeftSection />
    <div class="container wrapper comment__page">
      <BackButtonRibbon />
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
        <div
          v-if="comment.children.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="[error ? 'error' : '']"
        >
          {{ $t('views.SingleCommentView.NoResultsMsg') }}
        </div>

        <TipComment
          v-for="nestedComment in comment.children"
          :key="nestedComment.id"
          :comment="nestedComment"
        />
        <div
          v-if="showLoading"
          class="text-center w-100 mt-3"
        >
          <Loading :show-loading="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-cycle
import Backend from '../utils/backend';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
// eslint-disable-next-line import/no-cycle
import MobileNavigation from '../components/layout/MobileNavigation.vue';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import SendComment from '../components/SendComment.vue';

export default {
  name: 'CommentView',
  components: {
    Loading,
    TipComment,
    LeftSection,
    RightSection,
    MobileNavigation,
    BackButtonRibbon,
    SendComment,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      error: false,
      comment: null,
      tipId: this.$route.params.tipId,
    };
  },
  created() {
    this.loadComment();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async reloadData() {
      this.comment = await Backend.getCommentById(this.id);
    },
    async loadComment() {
      this.showLoading = true;
      await this.reloadData();
      this.showLoading = false;
    },
  },
};
</script>

<style lang="scss">
.comment__page .tipped__url .tip__record.row {
  background-color: $light_color;
  border-radius: 0;
}
</style>
