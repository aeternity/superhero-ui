<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper url__page">
      <div class="actions-ribbon">
        <router-link :to="{ name: 'home' }">
          <img src="../assets/backArrow.svg">
        </router-link>
      </div>
      <div
        v-if="tip"
        class="tipped__url"
      >
        <tip-record :tip="tip" />
      </div>
      <div class="comment__section">
        <p class="latest__comments">
          Latest comments
        </p>
        <div class="d-flex">
          <img
            class="mr-3 avatar"
            :src="avatar"
          >
          <div class="input-group">
            <input
              v-model="newComment"
              type="text"
              placeholder="Add comment"
              class="form-control"
            >
            <b-button
              size="sm"
              :disabled="newComment.length === 0 || showLoading"
              @click="sendTipComment()"
            >
              {{ $t('system.Send') }}
            </b-button>
          </div>
        </div>
      </div>
      <div class="comments__section">
        <div
          v-if="comments.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="[error ? 'error' : '']"
        >
          {{ $t('pages.TipComments.NoResultsMsg') }}
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
import Backend from '../utils/backend';
import { USE_DEEP_LINKS } from '../utils/util';
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';
import { wallet } from '../utils/walletSearch';
import Loading from '../components/Loading.vue';
import defaultAvatar from '../assets/userAvatar.svg';
import { EventBus } from '../utils/eventBus';

export default {
  name: 'TipCommentsView',
  components: {
    Loading,
    TipRecord,
    TipComment,
    LeftSection,
    RightSection,
    MobileNavigation,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      comments: [],
      error: false,
      newComment: '',
      avatar: defaultAvatar,
      tip: null,
    };
  },
  computed: {
    ...mapGetters(['settings', 'account', 'chainNames', 'isLoggedIn']),
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
        this.avatar = this.getAvatar(this.account);
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
    getAvatar(address) {
      const userImage = Backend.getProfileImageUrl(address);
      return userImage || this.avatar;
    },
    async sendTipComment() {
      if (USE_DEEP_LINKS) {
        const url = new URL(`${process.env.VUE_APP_WALLET_URL}/comment`);
        url.searchParams.set('id', this.tip.id);
        url.searchParams.set('text', this.newComment);
        url.searchParams.set('x-success', window.location);
        url.searchParams.set('x-cancel', window.location);
        window.location = url;
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


<style lang="scss" scoped>
.url__page{
  color: $light_font_color;
  font-size: .75rem;

  .avatar{
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .input-group{
    width: calc(100% - 2.5rem)
  }
  .tipped__url{
    .tip__record{
      margin-bottom: 0;
      &.row{
        background-color: $actions_ribbon_background_color;
      }
    }
  }
  .comments__section{
    background-color: $actions_ribbon_background_color;
    padding: 1rem;
  }
  .no-results{
    color: $standard_font_color;
    font-size: .75rem;
    text-align: center;
    &.error{
      color: red;
    }
  }
  .comment__section {
    background-color: $actions_ribbon_background_color;
    padding: 0.75rem 1rem;

    p {
      font-size: .75rem;
      text-transform: capitalize;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 600;
    }
  }
}
</style>
