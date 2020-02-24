<template>
 <div class="comments__modal mr-1 ml-1" :title="$t('reused.commentsModalTitle')">
  <span @click="toggleModal(!modalShow)"><img src="../assets/commentsIcon.svg"></span>

    <b-modal v-model="modalShow" size="lg" hide-footer hide-header no-close-on-esc>
      <div>{{$t('reused.commentsModalTitle')}}</div>
      <textarea v-model="comment" class="w-100 comment__area"></textarea>
      <div class="w-100 text-center comments__actions">
        <b-button
          variant="primary"
          size="sm"
          @click="modalShow=false"
        >
          {{$t('system.Cancel')}}
        </b-button>
        <b-button
          size="sm"
          @click="sendCommentMethod()"
          :disabled="comment.length == 0"
        >
          {{$t('system.Send')}}
        </b-button>
      </div>
    </b-modal>
</div>
</template>

<script>
  export default {
    props: ['sendComment', 'tip'],
    data() {
      return {
        modalShow: false,
        comment: ''
      }
    },
    methods: {
      toggleModal(flag){
        this.modalShow = flag;
        if(flag){
          this.comment = '';
        }
      },
      sendCommentMethod(){
        if(this.sendComment){
          let postData = {
            comment: this.comment,
            tip: this.tip
          }
          this.sendComment(postData);
        }
        this.toggleModal(false);
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles/base";
  .comments__modal{
    display: inline-block;
    &:hover{
      cursor: pointer;
    }
  }
  .comment__area{
    font-size: .75rem;
    min-height: 5rem;
  }
  .comments__actions button{
    margin-right: .5rem;
  }
  .modal-content.modal-content{
    background-color: $actions_ribbon_background_color;
    color: $standard_font_color;
  }
</style>