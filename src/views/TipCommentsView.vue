<template>
<div>
  <custom-header></custom-header>
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
      <tip-record :tip="tip" @updateComment="onUpdateComment" :senderLink="openExplorer(tip.sender)"></tip-record>
    </div>
    <div class="comment__section">
      <p class="latest__comments">Latest comments</p>
      <div class="d-flex">
          <img class="mr-3 avatar" src="../assets/userAvatar.svg">
          <div class="input-group">
            <input type="text" placeholder="Add comment" v-model="comment" class="form-control">
            <b-button
                size="sm"
                @click="sendTipComment()"
                :disabled="comment.length == 0"
              >
                {{$t('system.Send')}}
            </b-button>
          </div>
      </div>

    </div>
    <div class="comments__section">
      <div class="no-results text-center w-100" v-bind:class="[error == true? 'error' : '']" v-if="comments.length == 0 && !loading">{{$t('pages.TipComments.NoResultsMsg')}}</div>
      <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment" :senderLink="openExplorer(comment.author)"></tip-comment>
      <div class="text-center spinner__container w-100 mt-3" v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import Backend from "../utils/backend";
  import TipRecord from "../components/tipRecords/TipRecord.vue"
  import TipComment from "../components/tipRecords/TipComment.vue"
  import Header from '../components/layout/Header.vue';
  import LeftSection from '../components/layout/LeftSection.vue';
  import RightSection from '../components/layout/RightSection.vue';
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';

  const backendInstance = new Backend();

  export default {
    name: 'TipCommentsView',
    components: {
      'tip-record': TipRecord,
      'tip-comment': TipComment,
      'custom-header': Header,
      'left-section': LeftSection,
      'right-section': RightSection,
    },
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        tip: null,
        id: this.$route.params.id,
        loading: true,
        comments: [],
        error: false,
        comment: ''
      }
    },
    computed: {
      ...mapGetters(['tips', 'settings', 'account'])
    },
    watch: {
      tips() {
        this.updateTip();
      }
    },
    methods: {
      sendTipComment(){
        if(this.sendComment){
          let postData = {
            comment: this.comment,
            tip: this.tip
          }
          this.sendComment(postData);
        }
        this.comment = '';
      },
      updateTip() {
        // Avoid empty trigger
        if(this.tips.length === 0) return;
        this.tip = this.tips.find(x => x.id === parseInt(this.id));
        // Avoid backend spam
        if(this.comments.length === 0) {
          backendInstance.getTipComments(this.id).then((response) => {
            this.loading = false;
            this.error = false;
            console.log(response)
            if (typeof response !== 'undefined' && response.length > 0) {
              this.comments = response;
            }
          }).catch(err => {
            this.error = true;
            this.loading = false;
          });
        }
      },
      sendComment(data){

        let postData = {
          tipId: data.tip.id,
          text: data.comment,
          author: wallet.client.rpcClient.getCurrentAccount(),
        }

        console.log("sending comment => ", postData)

        backendInstance.sendTipComment(postData).then(async (response) => {
          console.log("challenge => ", response.challenge);
          console.log("signing with => ", wallet.client.rpcClient.getCurrentAccount())

          let signedChallenge = await wallet.signMessage(response.challenge)
          let respondChallenge = {
            challenge: response.challenge,
            signature: signedChallenge
          }

          backendInstance.sendTipComment(respondChallenge).then((result) => {
            console.log(result);
            this.$emit('updateComment', result)
          }).catch(console.error)
        }).catch(console.error);
      },
      openExplorer(address) {
        return this.explorerUrl + address
      },
      onUpdateComment(data){
        this.comments.push(data);
      }
    },
    created(){
      console.log(this.account);
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
  .spinner__container,.no-results{
    left: 0;
    @include vertical-align($position: relative);
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
