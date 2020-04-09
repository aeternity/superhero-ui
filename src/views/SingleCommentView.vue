<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper comment__page">
      <div class="actions-ribbon">
        <router-link :to="{ name: 'home' }">
          <img src="../assets/backArrow.svg">
        </router-link>
      </div>
      <div
        v-if="comment"
        class="tipped__url"
      >
        <tip-comment :comment="comment" />
      </div>
      <div class="comment__section">
        <p class="latest__comments">
          Latest Replies
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
              placeholder="Add reply"
              class="form-control reply__input"
            >
          </div>
        </div>
        <div class="send-comment">
          <ae-button
            :disabled="newComment.length === 0 || showLoading"
            @click="sendTipComment()"
          >
            Reply
          </ae-button>
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

        <!-- <tip-comment
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
        /> -->
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
// import { USE_DEEP_LINKS } from '../utils/util';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
// eslint-disable-next-line import/no-cycle
import MobileNavigation from '../components/layout/MobileNavigation.vue';
// import { wallet } from '../utils/walletSearch';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import AeButton from '../components/AeButton.vue';
import Avatar from '../components/Avatar.vue';

export default {
  name: 'CommentView',
  components: {
    Loading,
    TipComment,
    LeftSection,
    RightSection,
    MobileNavigation,
    AeButton,
    Avatar,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      comments: [],
      error: false,
      newComment: '',
      address: null,
      comment: null,
      tip: null,
    };
  },
  computed: {
    ...mapGetters(['settings', 'account', 'chainNames', 'isLoggedIn']),
  },
  // watch: {
  //   tip() {
  //     this.updateTip();
  //   },
  // },
  created() {
    this.loadComment();
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
    getAvatar(address) {
      const userImage = Backend.getProfileImageUrl(address);
      return userImage || this.avatar;
    },
    // async sendTipComment() {
    //   if (USE_DEEP_LINKS) {
    //     const url = new URL(`${process.env.VUE_APP_WALLET_URL}/comment`);
    //     url.searchParams.set('id', this.tip.id);
    //     url.searchParams.set('text', this.newComment);
    //     url.searchParams.set('x-success', window.location);
    //     url.searchParams.set('x-cancel', window.location);
    //     window.location = url;
    //     return;
    //   }
    //   this.showLoading = true;
    //   const response = await Backend.sendTipComment(
    //     this.tip.id,
    //     this.newComment,
    //     wallet.client.rpcClient.getCurrentAccount(),
    //     (data) => wallet.signMessage(data),
    //   );
    //   this.comments.push(response);
    //   this.showLoading = false;
    //   EventBus.$emit('reloadData');
    //   this.newComment = '';
    // },
    async reloadData() {
      this.comment = await Backend.getCommentById(this.id);
      console.log('this.comment');
      console.log(this.comment);
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
.comment__page
.tipped__url
.tip__record.row {
  background-color: $light_color;
  border-radius: 0;
}
</style>
