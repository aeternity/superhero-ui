<template>
<div>
  <right-section></right-section>
  <left-section></left-section>
  <div class="container url__page">
    <div class="actions-ribbon">
      <div class="row">
         <a class="back-url col-md-6 col-sm-12" href="/">
          <img src="../assets/backArrow.svg">{{$t('pages.TipComments.BackTo')}}<span> AE</span> {{$t('pages.TipComments.records')}}</a>
        <!-- <div class="col-md-6 col-sm-12 text-right sorting">
          <a>Date</a>
          <a>AE Records</a>
          <a>Comments</a>
          <a>All</a>
        </div> -->
      </div>
    </div>
    <div class="tipped__url" v-if="tip">
      <tip-record :tip="tip"></tip-record>
    </div>
    <div class="comment__section">
      <p class="latest__comments">Latest comments</p>
      <div class="d-flex">
          <img class="mr-3 avatar" src="../assets/userAvatar.svg">
          <div class="input-group">
            <input type="text" placeholder="Add comment" v-model="comment" class="form-control">
            <b-button size="sm" @click="sendTipComment()" :disabled="comment.length === 0 || showLoading">
              {{$t('system.Send')}}
            </b-button>
          </div>
      </div>

    </div>
    <div class="comments__section">
      <div class="no-results text-center w-100" v-bind:class="[error ? 'error' : '']" v-if="comments.length === 0 && !showLoading">{{$t('pages.TipComments.NoResultsMsg')}}</div>

      <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment"></tip-comment>
      <div class="text-center w-100 mt-3" v-if="showLoading">
        <loading :show-loading="true" />
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import Backend from "../utils/backend";
  import TipRecord from "../components/tipRecords/TipRecord.vue"
  import TipComment from "../components/tipRecords/TipComment.vue"
  import LeftSection from '../components/layout/LeftSection.vue';
  import RightSection from '../components/layout/RightSection.vue';
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';
  import Loading from "../components/Loading";

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
        comment: ''
      }
    },
    computed: {
      ...mapGetters(['tips', 'settings', 'account', 'chainNames']),
      tip() {
        return this.tips.find(x => x.id === parseInt(this.id));
      }
    },
    watch: {
      tip() {
        this.updateTip();
      }
    },
    methods: {
      async sendTipComment() {
        this.showLoading = true;

        let postData = {
          tipId: this.tip.id,
          text: this.comment,
          author: wallet.client.rpcClient.getCurrentAccount(),
        };

        const responseChallenge = await backendInstance.sendTipComment(postData);
        let signedChallenge = await wallet.signMessage(responseChallenge.challenge);
        let respondChallenge = {
          challenge: responseChallenge.challenge,
          signature: signedChallenge
        };

        const response = await backendInstance.sendTipComment(respondChallenge);
        this.comments.push(response);

        this.showLoading = false;
        this.comment = '';
      },
      updateTip() {
        backendInstance.getTipComments(this.id).then((response) => {
          this.error = false;
          this.comments = response.map(comment => {
            comment.chainNames = this.chainNames.filter(chainName => chainName.owner === comment.author);
            return comment;
          });
          this.showLoading = false;
        }).catch(e => {
          console.error(e);
          this.error = true;
          this.showLoading = false;
        });
      }
    },
    created(){
      this.updateTip();
    }
  }
</script>


<style lang="scss" scoped>
  @import "../styles/base";

.url__page{
  color: $light_font_color;
  font-size: .75rem;
  .avatar{
    width: 2rem;
  }
  .input-group{
    width: calc(100% - 2.5rem)
  }
  .actions-ribbon{
    padding: 1rem .5rem .5rem .5rem;
    .sorting a{
      margin-right: .5rem;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .tipped__url{
    .tip__record{
      margin-bottom: 0;
      &.row{
        background-color: $actions_ribbon_background_color;
      }
    }
  }
  .back-url,.sorting a{
    cursor: pointer;
  }
  .back-url{
    span{
      color: $secondary_color;
    }
    img{
      width: 1rem;
      margin-right: .25rem;
    }
  }
  .comments__section{
    .send-button {
      width: 3rem;
    }

    background-color: $actions_ribbon_background_color;
    overflow-y: auto;
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
