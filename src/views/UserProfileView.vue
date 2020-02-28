<template>
  <div class="container profile__page">
    <div class="profile__section clearfix position-relative">
      <div class="text-center spinner__container w-100" v-if="loadingProfile">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="row" v-bind:class="[loadingProfile ? 'invisible' : '']">
        <div class="col-lg-9 col-md-8 col-sm-12 profile__editable position-relative">
          <a class="edit__button" @click="toggleEditMode(true)" v-if="!editMode" title="Edit Profile"><img src="../assets/editIcon.svg"></a>
          <div class="profile__image position-relative" >
            <div class="overlay" v-if="loadingAvatar"></div>
            <div class="text-center spinner__container w-100" v-if="loadingAvatar">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <label for="file-input" v-if="editMode" class="position-relative profile__image--edit" v-bind:class="[loadingAvatar ? 'blurred' : '']">
              <img v-bind:src="avatar"/>
              <div>Change Avatar</div>
            </label>
            <div v-bind:class="[loadingAvatar ? 'blurred' : '']">
              <img v-bind:src="avatar" v-if="!editMode">
            </div>
            <input id="file-input" type="file" name="avatar" v-if="editMode" accept="image/png, image/jpeg">
          </div>
          <div class="profile__info">
            <h1 class="profile__displayname" v-if="!editMode">{{profile.displayName}}</h1>
            <div class="input-group" v-if="editMode">
              <input type="text" v-model="profile.displayName" class="form-control" placeholder="Edit Display Name">
            </div>
            <a class="profile__username" v-if="!editMode">{{userName}}</a>
          </div>
          <div class="profile__description" v-if="!editMode">{{profile.biography}}</div>
          <div class="input-group" v-if="editMode">
            <textarea class="form-control" v-model="profile.biography" rows="3" placeholder="Edit Biography"></textarea>
          </div>
          <div class="mt-2 mb-2" v-if="editMode">
            <button type="button" @click="resetEditedValues()" class="btn btn-dark mr-2">Cancel</button>
            <button type="button" @click="saveProfile()" class="btn btn-dark">Save</button>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-12 profile__meta">
          <div class="row">
            <div class="col-8">Tippers</div>
            <div class="col-4 value">70</div>
            <div class="col-8">Followers</div>
            <div class="col-4 value">50</div>
            <div class="col-8">Daily Audience</div>
            <div class="col-4 value">120</div>
            <div class="col-8">Total Received</div>
            <div class="col-4 value">2000 AE</div>
            <div class="col-8">Users Tipped</div>
            <div class="col-4 value">100</div>
            <div class="col-8">Total Spent</div>
            <div class="col-4 value">1500 AE</div>
            <div class="col-8">Tips Received</div>
            <div class="col-4 value">200</div>
            <div class="col-8">Tips Claimed</div>
            <div class="col-4 value">200</div>
            <div class="col-8">Tips Unclaimed</div>
            <div class="col-4 value">0</div>
          </div>
          <div class="row mobile">
            <div class="col-6">
              <div class="row">
                <div class="col-7">Total Spent</div>
                  <div class="col-5 value">1500 AE</div>
                  <div class="col-7">Tips Received</div>
                  <div class="col-5 value">200</div>
                  <div class="col-7">Tips Claimed</div>
                  <div class="col-5 value">200</div>
                  <div class="col-7">Tips Unclaimed</div>
                  <div class="col-5 value">0</div>
              </div>
            </div>
            <div class="col-6">
              <div class="row">
                <div class="col-7">Tippers</div>
                <div class="col-5 value">70</div>
                <div class="col-7">Followers</div>
                <div class="col-5 value">50</div>
                <div class="col-7">Daily Audience</div>
                <div class="col-5 value">120</div>
                <div class="col-7">Total Received</div>
                <div class="col-5 value">2000 AE</div>
                <div class="col-7">Users Tipped</div>
                <div class="col-5 value">100</div>
              </div>
            </div>
          </div>
        </div>
       </div>
       <div class="profile__actions">
         <a>All</a>
         <a>Sent Tips</a>
         <a>Received Tips</a>
         <a>Comments</a>
         <a>Date</a>
       </div>
    </div>
    <div class="comments__section position-relative">
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
  import RetipComment from "../components/tipRecords/RetipComponent.vue"
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';

  const backendInstance = new Backend();

  export default {
    props: ['address'],
    name: 'TipCommentsView',
    components: {
      'tip-comment': TipComment,
      'retip-component': RetipComment,
    },
     data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        tip: this.tipData,
        loading: false,
        comments: [],
        error: false,
        userName: this.address,
        editingDisplayName: '',
        editingDescription: '',
        editMode: false,
        loadingProfile: false,
        loadingAvatar: false,
        profile: {
          biography: '',
          displayName: '',
        },
        avatar: '../assets/userAvatar.svg'
      }
    },
    computed: {
      ...mapGetters(['current', 'account'])
    },
    methods: {
      openExplorer(address) {
        return this.explorerUrl + address
      },
      onUpdateComment(data){
        this.comments.push(data);
      },
      toggleEditMode(flag){
        this.editMode = !this.editMode;
      },
      resetEditedValues(){
        this.getProfile();
        this.toggleEditMode(false);
      },
      saveProfile(){
        let postData = {
          biography: this.biography,
          author: wallet.client.rpcClient.getCurrentAccount(),
        }

        console.log("sending profile => ", postData)
        
        backendInstance.sendProfileData(postData).then(async (response) => {
          console.log(response)
          console.log("challenge => ", response.challenge);
          console.log("signing with => ", wallet.client.rpcClient.getCurrentAccount())
         
          let signedChallenge = await wallet.signMessage(response.challenge)
          let respondChallenge = {
            challenge: response.challenge,
            signature: signedChallenge
          }

          backendInstance.sendProfileData(respondChallenge).then((result) => {
            console.log(result);
            this.getProfile()
            // this.$emit('updateComment', result)
          }).catch(console.error)
        }).catch(console.error);
      },
      getProfile() {
        // backendInstance.getProfileImage(this.address).then((response) => {}).catch(console.error);
        backendInstance.getProfile(this.address).then((response) => {
          if(typeof response !== 'undefined' && response !== null){
            this.profile = response
          }
        }).catch(console.error);
      }
    },
    created(){
      this.getProfile();

      backendInstance.getAllComments().then((response) => {
        this.loading = false;
        this.error = false;
        if(typeof response !== 'undefined' && response.length > 0){
          this.comments = response.filter(comment => comment.author == this.address);
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

  #file-input{
    display: none;
  }
  .profile__page{
    margin-top: 1rem;
    a{
      color: $custom_links_color;
      cursor: pointer;
    }
    .edit__button{
      position: absolute;
      top: 0;
      right: 1rem;
      img{
        width: .75rem;
      }
    }
    color: $light_font_color;
    font-size: .75rem;
    .profile__section{
      background-color: $actions_ribbon_background_color;
      border-radius: .25rem;
      .spinner__container{
        top: 40%;
      }
      .row{
        padding: .5rem 1rem 1rem 1rem;
        border-bottom-right-radius: .25rem;
        border-bottom-left-radius: .25rem;
        margin-right: -1rem;
      }
      .profile__image{
        margin-right: .5rem;
        vertical-align: super;
        .spinner__container{
          top: 45%;
        }
        .blurred{
          opacity: .4;
        }
        .overlay{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
        }
        .profile__image--edit{
          &>div{
            position: absolute;
            top: 20%;
            text-align: center;
            color: $standard_font_color;
          }
          img{
              opacity: .2;
          }
          &:hover{
            cursor: pointer;
            
          }
        }
        img{
          width: 4rem;
          height: 4rem;
          border-radius: 2rem;
        }
      } 
      .profile__info, .profile__image{
        display: inline-block;
      }
      .profile__info{
        width: calc(100% - 6rem);
        .profile__displayname{
          font-size: 1.2rem;
        }
        .profile__username, .profile__displayname{
          margin-bottom: 0;
        }
        .profile__username{
          display: block;
          font-size: .6rem;
        }
      }
    }
    .profile__meta{
      font-size: .6rem;
      background-color: $thumbnail_background_color;
      margin: -.5rem 0 -1rem 0;
      border-top-right-radius: .25rem;
      padding: 0;
      &>.row.mobile{
        display: none;
      }
      .value{
        color: $secondary_color;
      }
    }
    .profile__actions{
      text-align: right;
      padding: .5rem;
      background-color: $background_color;

      a{
          color: $light_font_color;
          margin-right: .5rem;
          &:last-child{
            margin-right: 0;
          }
          &:hover{
            color: $primary_color;
          }
          &:active{
            color: $secondary_color;
          }
        }
    }
  }
  .comments__section{
    min-height: 5rem;
    background-color: $tip_list_background_color;
    overflow-y: auto;
    padding: 1rem;
    border-radius: .25rem;
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

@media only screen and (max-width: 768px){
  .profile__description{padding-bottom: .5rem; font-size: .65rem;}
  .profile__page .profile__meta{
    margin-top: 0;
    border-top-right-radius: 0;
  }
  .profile__page .profile__section>.row{
    padding-left: .75rem;
  }
  .profile__page .profile__meta>.row{
    display: none;
    &.mobile{
      display: flex;
      padding-bottom: 0;
      & .row{
        padding-bottom: .5rem;
        padding-top: 0;
      }
    }
  }
}
</style>
