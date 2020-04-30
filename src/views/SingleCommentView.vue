<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper comment__page">
      <back-button-ribbon />
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
              :disabled="!canTip"
            >
          </div>
        </div>
        <div class="send-comment">
          <div
            v-if="!canTip"
            class="install-wallet-warning"
          >
            You need to have a wallet installed and active in order to comment.
          </div>
          <ae-button
            :disabled="newComment.length === 0 || !canTip"
            @click="sendTipComment()"
          >
            Reply
          </ae-button>
        </div>
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
          {{ $t('pages.TipComments.NoResultsMsg') }}
        </div>

        <tip-comment
          v-for="nestedComment in comment.children"
          :key="nestedComment.id"
          :comment="nestedComment"
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
import { USE_DEEP_LINKS } from '../utils/util';
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
  name: 'CommentView',
  components: {
    Loading,
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
      error: false,
      newComment: '',
      address: null,
      comment: null,
      tipId: this.$route.params.tipId,
      USE_DEEP_LINKS,
    };
  },
  computed: {
    ...mapGetters(['account', 'isLoggedIn']),
    canTip() {
      return !this.USE_DEEP_LINKS && this.isLoggedIn;
    },
  },
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
    async sendTipComment() {
      this.showLoading = true;
      await Backend.sendTipComment(
        this.tipId,
        this.newComment,
        wallet.client.rpcClient.getCurrentAccount(),
        (data) => wallet.signMessage(data),
        this.id,
      );
      this.showLoading = false;
      EventBus.$emit('reloadData');
      this.newComment = '';
    },
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
