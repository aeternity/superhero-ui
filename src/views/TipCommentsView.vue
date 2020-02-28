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
      <tip-record :tip="tip" :defaultCurrency="defaultCurrency" :fiatValue="tip.fiatValue" @updateComment="onUpdateComment" :senderLink="openExplorer(tip.sender)"></tip-record>
    </div>
    <div class="comments__section position-relative">
      <div class="no-results text-center w-100" v-bind:class="[error == true? 'error' : '']" v-if="comments.length == 0 && !loading">{{$t('pages.TipComments.NoResultsMsg')}}</div>
      <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment" :senderLink="openExplorer(comment.author)"></tip-comment>
      <div class="text-center spinner__container w-100" v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
       <!-- <tip-comment v-if="tip != undefined" :tip="tip"></tip-comment> -->
      <!-- <retip-component v-if="tip != undefined" :tip="tip"></retip-component>  -->
    </div>
  </div>
  </div>
</template>

<script>
  import Backend from "../utils/backend";
  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"
  import TipComment from "../components/tipRecords/TipCommentComponent.vue"
  import RetipComment from "../components/tipRecords/RetipComponent.vue"

  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';

  const backendInstance = new Backend();

  export default {
    name: 'TipCommentsView',
    components: {
      'tip-record': TipRecord,
      'tip-comment': TipComment,
      'retip-component': RetipComment,
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
    },
    data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        tip: null,
        tipId: this.$route.params.tipId,
        loading: false,
        comments: [],
        error: false
      }
    },
    computed: {
      ...mapGetters(['tips', 'defaultCurrency'])
    },
    methods: {
      openExplorer(address) {
        return this.explorerUrl + address
      },
      onUpdateComment(data){
        this.comments.push(data);
      }
    },
    created(){
      this.tip = this.tips[this.tips.findIndex(x => x.tipId == this.tipId)]
      this.loading = true;
      backendInstance.getTipComments(this.tipId).then((response) => {
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
    @include vertical-align($position: absolute);
  }
}
</style>
