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
          class="loading-position"
        />
        <div
          v-if="comments.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="[error ? 'error' : '']"
        >
          {{ $t('views.TipCommentsView.NoResultsMsg') }}
        </div>

        <TipCommentList
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
        />
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
// eslint-disable-next-line import/no-cycle
import Backend from '../utils/backend';
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipCommentList from '../components/tipRecords/TipCommentList.vue';
import Page from '../components/layout/Page.vue';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import SendComment from '../components/SendComment.vue';

export default {
  name: 'TipCommentsView',
  components: {
    Loading,
    TipRecord,
    TipCommentList,
    Page,
    SendComment,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      comments: [],
      error: false,
      tip: null,
    };
  },
  computed: mapGetters(['chainNames']),
  watch: {
    tip() {
      this.updateTip();
    },
  },
  created() {
    this.loadTip();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    updateTip() {
      this.showLoading = true;
      Backend.getTipComments(this.id).then((response) => {
        this.error = false;
        this.comments = response.map((comment) => {
          const newComment = comment;
          newComment.chainName = this.chainNames[newComment.author];
          return newComment;
        });
        this.showLoading = false;
      }).catch((e) => {
        console.error(e);
        this.error = true;
        this.showLoading = false;
      });
    },
    async reloadData() {
      this.tip = await Backend.getCacheTipById(this.id);
      if (this.tip === null) {
        this.error = true;
        return;
      }
      this.updateTip();
    },
    async loadTip() {
      this.showLoading = true;
      await this.reloadData();
      this.showLoading = false;
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

    .loading-position {
      position: absolute;
      margin-left: -1rem;
    }
  }

  .no-results {
    color: $standard_font_color;
    font-size: 0.75rem;
    text-align: center;

    &.error {
      color: red;
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
