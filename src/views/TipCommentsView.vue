<template>
<div>
  <right-section></right-section>
  <left-section></left-section>
  <div class="container wrapper url__page">
    <div class="actions-ribbon">
      <router-link :to="{ name: 'home' }">
        <img src="../assets/backArrow.svg">
      </router-link>
    </div>
    <div class="tipped__url" v-if="tip">
      <tip-record :tip="tip"></tip-record>
    </div>
    <div class="comment__section">
      <p class="latest__comments">Latest comments</p>
      <div class="d-flex">
          <img class="mr-3 avatar" :src="avatar">
          <div class="input-group">
            <input type="text" placeholder="Add comment" v-model="comment" class="form-control">
            <b-button
              size="sm"
              @click="sendTipComment()"
              :disabled="comment.length === 0 || showLoading"
            >
              {{$t('system.Send')}}
            </b-button>
          </div>
      </div>

    </div>
    <div class="comments__section">
      <div
        class="no-results text-center w-100"
        v-bind:class="[error ? 'error' : '']"
        v-if="comments.length === 0 && !showLoading"
      >
        {{$t('pages.TipComments.NoResultsMsg')}}
      </div>

      <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment" />
      <div class="text-center w-100 mt-3" v-if="showLoading">
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
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
// eslint-disable-next-line import/no-cycle
import { wallet } from '../utils/walletSearch';
import Loading from '../components/Loading.vue';
import defaultAvatar from '../assets/userAvatar.svg';

const backendInstance = new Backend();

export default {
  name: 'TipCommentsView',
  components: {
    Loading,
    TipRecord,
    TipComment,
    LeftSection,
    RightSection,
  },
  data() {
    return {
      id: this.$route.params.id,
      showLoading: true,
      comments: [],
      error: false,
      comment: '',
      avatar: defaultAvatar,
    };
  },
  computed: {
    ...mapGetters(['tips', 'settings', 'account', 'chainNames', 'isLoggedIn']),
    tip() {
      return this.tips.find((x) => x.id === parseInt(this.id, 10));
    },
  },
  watch: {
    tip() {
      this.updateTip();
    },
  },
  methods: {
    getAvatar(address) {
      const userImage = Backend.getProfileImageUrl(address);
      return userImage || this.avatar;
    },
    async sendTipComment() {
      this.showLoading = true;

      const postData = {
        tipId: this.tip.id,
        text: this.comment,
        author: wallet.client.rpcClient.getCurrentAccount(),
      };

      const responseChallenge = await backendInstance.sendTipComment(postData);
      const signedChallenge = await wallet.signMessage(responseChallenge.challenge);
      const respondChallenge = {
        challenge: responseChallenge.challenge,
        signature: signedChallenge,
      };

      const response = await backendInstance.sendTipComment(respondChallenge);
      this.comments.push(response);
      this.showLoading = false;
      this.comment = '';
    },
    updateTip() {
      backendInstance.getTipComments(this.id).then((response) => {
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
  },
  created() {
    this.updateTip();
    const loadUserAvatar = setInterval(() => {
      if (this.isLoggedIn) {
        this.avatar = this.getAvatar(this.account);
        clearInterval(loadUserAvatar);
      }
    }, 500);
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
