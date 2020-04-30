<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper url__page">
      <back-button-ribbon />
      <div
        v-if="tip"
        class="tipped__url"
      >
        <tip-record :tip="tip" />
      </div>
      <div class="comment__section">
        <p class="latest__comments">
          {{ $t('views.TipCommentsView.LatestReplies') }}
        </p>
        <div class="d-flex">
          <Avatar
            :address="address"
            class="avatar mr-3"
          />
          <div class="input-group">
            <input
              v-model="newComment"
              type="text"
              :placeholder="$t('views.TipCommentsView.AddReply')"
              class="form-control reply__input"
            >
          </div>
        </div>
        <div class="send-comment">
          <ae-button
            :disabled="newComment.length === 0"
            @click="sendTipComment()"
          >
            {{ $t('views.TipCommentsView.Reply') }}
          </ae-button>
        </div>
      </div>
      <div class="comments__section">
        <div
          v-if="comments.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="[error ? 'error' : '']"
        >
          {{ $t('views.TipCommentsView.NoResultsMsg') }}
        </div>

        <tip-comment
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
        />
        <div
          v-if="showLoading"
          class="text-center w-100 mt-3"
        >
          <loading :show-loading="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// eslint-disable-next-line import/no-cycle
import Backend from '../utils/backend';
import { USE_DEEP_LINKS, createDeepLinkUrl } from '../utils/util';
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
// eslint-disable-next-line import/no-cycle
import MobileNavigation from '../components/layout/MobileNavigation.vue';
import { wallet } from '../utils/walletSearch';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import AeButton from '../components/AeButton.vue';
import Avatar from '../components/Avatar.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';

export default {
  name: 'TipCommentsView',
  components: {
    Loading,
    TipRecord,
    TipComment,
    LeftSection,
    RightSection,
    MobileNavigation,
    AeButton,
    Avatar,
    BackButtonRibbon,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      comments: [],
      error: false,
      newComment: '',
      address: null,
      tip: null,
      USE_DEEP_LINKS,
    };
  },
  computed: {
    ...mapGetters(['account', 'chainNames', 'isLoggedIn', 'loading']),
  },
  watch: {
    tip() {
      this.updateTip();
    },
  },
  created() {
    this.loadTip();
    const loadUserAvatar = setInterval(() => {
      if (this.isLoggedIn) {
        this.address = this.account;
        clearInterval(loadUserAvatar);
      }
    }, 500);

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async sendTipComment() {
      if (this.USE_DEEP_LINKS || !this.isLoggedIn) {
        window.location = createDeepLinkUrl(
          { type: 'comment', id: this.tip.id, text: this.newComment },
        );
        return;
      }
      this.showLoading = true;
      const response = await Backend.sendTipComment(
        this.tip.id,
        this.newComment,
        wallet.client.rpcClient.getCurrentAccount(),
        (data) => wallet.signMessage(data),
      );
      this.comments.push(response);
      this.showLoading = false;
      EventBus.$emit('reloadData');
      this.newComment = '';
    },
    updateTip() {
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
.url__page {
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

  .reply__input {
    width: 100%;
  }

  .send-comment {
    margin-top: 0.5rem;
    text-align: right;

    .ae-button {
      padding: 0.55rem 2.87rem 0.65rem 2.87rem;
    }
  }
}
</style>
