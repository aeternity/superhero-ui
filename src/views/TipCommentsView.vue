<template>
<div>
  <header-component></header-component>
  <right-section></right-section>
  <left-section></left-section>
  <div class="container url__page">
    <div class="actions-ribbon">
      <div class="row">
         <a class="back-url col-md-6 col-sm-12" href="/"><img src="../assets/backArrow.svg">{{$t('pages.TipComments.BackTo')}}<span> AE</span> {{$t('pages.TipComments.records')}}</a>
        <!-- <div class="col-md-6 col-sm-12 text-right sorting">
          <a>Date</a>
          <a>AE Records</a>
          <a>Comments</a>
          <a>All</a>
        </div> -->
      </div>
    </div>
    <div class="tipped__url">
      <tip-record :tip="tip" :currency="current.currency" :fiatValue="tip.fiatValue" @updateComment="onUpdateComment" :senderLink="openExplorer(tip.sender)"></tip-record>
    </div>
    <div class="comment__section">
      <p class="latest__comments">Latest comments</p>
      <div class="row">
        <div class="col-sm-3">
          <img class="mr-1 avatar" src="../assets/userAvatar.svg">
        </div>
        <div class="col-sm-9">
          <div class="input-group col-md-12 col-lg-12 col-sm-12">
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
      
    </div>
    
      <div class="no-results text-center w-100" v-bind:class="[error == true? 'error' : '']" v-if="comments.length == 0 && !loading">{{$t('pages.TipComments.NoResultsMsg')}}</div>
      <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment" :senderLink="openExplorer(comment.author)"></tip-comment>
      <div class="text-center spinner__container w-100" v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Backend from "../utils/backend";
  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"
  import TipComment from "../components/tipRecords/TipCommentComponent.vue"
  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';

  const backendInstance = new Backend();

  export default {
    name: 'TipCommentsView',
    components: {
      'tip-record': TipRecord,
      'tip-comment': TipComment,
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
    },
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        tip: null,
        id: this.$route.params.id,
        loading: false,
        comments: [],
        error: false,
        comment: ''
      }
    },
    computed: {
      ...mapGetters(['tips', 'current', 'isLoggedIn', 'account'])
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
      this.tip = this.tips.find(x => x.id === this.id);
      this.loading = true;
      backendInstance.getTipComments(this.id).then((response) => {
        this.loading = false;
        this.error = false;
        if(typeof response !== 'undefined' && response.length > 0){
          this.comments = response;
        }
      }).catch(err => {
        this.error = true;
        this.loading = false;
      });
    }
  }
</script>


<style lang="scss" scoped>
  @import "../styles/base";
.url__page{
  color: $light_font_color;
  font-size: .75rem;
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
    border-bottom: .065rem solid $secondary_color;
    .tip__record{
      margin-bottom: 0;
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
    min-height: 65vh;
    background-color: $tip_list_background_color;
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
    padding: 0.75rem;
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
