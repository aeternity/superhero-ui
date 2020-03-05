<template>
  <div>
    <header-component>
      <div class="profile__header">
        <div class="address">{{trimAddress}}</div>
        <div class="count">{{userTips.length}} Tips</div>
      </div>
    </header-component>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container profile__page">
      <div class="profile__section clearfix position-relative">
        <div class="text-center spinner__container w-100" v-if="loadingProfile">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="row" v-bind:class="[loadingProfile ? 'invisible' : '']">
          <div class="col-lg-12 col-md-12 col-sm-12 profile__editable position-relative">
            <a class="edit__button" @click="toggleEditMode(true)" v-if="!editMode" title="Edit Profile">Edit Profile</a>
            <div class="profile__image position-relative" >
              <div class="overlay" v-if="loadingAvatar"></div>
              <div class="text-center spinner__container w-100" v-if="loadingAvatar">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <!-- <label for="file-input" v-if="editMode" class="position-relative profile__image--edit" v-bind:class="[loadingAvatar ? 'blurred' : '']"> -->
                <img v-bind:src="avatar"/>
                <!-- <div>Change Avatar</div> -->
              <!-- </label> -->
              <!-- <div v-bind:class="[loadingAvatar ? 'blurred' : '']">
                <img v-bind:src="avatar" v-if="!editMode">
              </div> -->
              <!-- <input id="file-input" type="file" name="avatar" v-if="editMode" accept="image/png, image/jpeg"> -->
            </div>
            <div class="profile__info">
              <h1 class="profile__displayname" v-if="!editMode">{{profile.displayName}}</h1>
              <!-- <div class="input-group" v-if="editMode">
                <input type="text" v-model="profile.displayName" class="form-control" placeholder="Edit Display Name">
              </div> -->
              <a class="profile__username" v-if="!editMode" :title="address">{{trimAddress}}</a>
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
        </div>

      </div>
        <div class="profile__actions">
          <a v-bind:class="{ active: activeTab === 'all' }" @click="setActiveTab('all')">All</a>
          <!-- <a>Sent Tips</a>
          <a>Received Tips</a> -->
          <a  v-bind:class="{ active: activeTab === 'comments' }" @click="setActiveTab('comments')">Comments</a>
        </div>
      <div class="comments__section position-relative">
        <div class="no-results text-center w-100" v-bind:class="[error == true? 'error' : '']" v-if="showNoResultsMsg()">{{'There is no activity to display.'}}</div>
          <div v-if="activeTab == 'all'">
            <div v-if="userTips.length">
              <tip-record v-for="(tip,index) in userTips"
                :key="index"
                :tip="tip"
                :fiatValue="tip.fiatValue"
                :senderLink="openExplorer(tip.sender)">
              </tip-record>
            </div>
          </div>
        <tip-comment v-for="(comment, index) in comments" :key="index"  :comment="comment" :senderLink="openExplorer(comment.author)"></tip-comment>
        <div class="text-center spinner__container w-100" v-if="loading">
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
  import TipRecord from "../components/tipRecords/TipRecordComponent.vue"
  import TipComment from "../components/tipRecords/TipCommentComponent.vue"
  import LeftSectionComponentVue from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponentVue from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';
  import HeaderComponentVue from '../components/layout/HeaderComponent.vue';

  const backendInstance = new Backend();

  export default {
    props: ['address'],
    name: 'TipCommentsView',
    components: {
      'tip-comment': TipComment,
      'left-section': LeftSectionComponentVue,
      'right-section': RightSectionComponentVue,
      'header-component': HeaderComponentVue,
      TipRecord
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
        activeTab: 'all',
        profile: {
          biography: '',
          displayName: '',
        },
        avatar: '../assets/userAvatar.svg'
      }
    },
    computed: {
      ...mapGetters(['current', 'account', 'tips']),
      trimAddress() {
        return this.address.substring(0, 5) + ('(...)') + this.address.substring(this.address.length - 5, this.address.length)
      },
      userTips() {
        return this.tips = this.tips.filter(tip => tip.sender === this.address);
      }
    },
    methods: {
      showNoResultsMsg(){
        if(this.activeTab == 'comments'){
          return this.comments.length == 0 && !this.loading
        }else{
          return this.comments.length == 0 && this.userTips.length == 0 && !this.loading
        }
      },
      setActiveTab(tab){
        this.activeTab = tab;
      },
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
          biography: this.profile.biography,
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
            this.resetEditedValues()
            // this.$emit('updateComment', result)
          }).catch(console.error)
        }).catch(console.error);
      },
      getProfile() {
        // backendInstance.getProfileImage(this.address).then((response) => {}).catch(console.error);
        backendInstance.getProfile(this.address).then((response) => {
          console.log('getting profile for address: ', this.address)
          console.log(response)
          if(typeof response !== 'undefined' && response !== null){
            this.profile = response
          }
        }).catch(console.error);
      }
    },
    created(){
      this.getProfile();
      this.loading = true;
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

  .profile__header{
    padding: .25rem 1rem;
    background-color: $actions_ribbon_background_color;
    .address{
      color: $standard_font_color;
    }
    .count{
      color: $light_font_color;
      font-size: .6rem;
    }
  }
  #file-input{
    display: none;
  }
  .profile__page{
    margin-top: .125rem;
    a{
      color: $custom_links_color;
      cursor: pointer;
    }
    .edit__button{
      color: $standard_font_color;
      border: .065rem solid $standard_font_color;
      border-radius: .25rem;
      padding: .2rem .5rem .2rem .5rem;
      text-align: center;
      font-size: 0.65rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 1rem;
    }
    color: $light_font_color;
    font-size: .75rem;
    .profile__section{
      background-color: $actions_ribbon_background_color;
      .spinner__container{
        top: 40%;
      }
      .row{
        padding: .5rem 1rem 1rem 1rem;
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
          color: $secondary_color;
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
      padding-left: 1rem;
      margin-top: .125rem;
      background-color: $actions_ribbon_background_color;
      a{
        font-weight: 600;
        color: $light_font_color;
        padding: .5rem;
        display: inline-block;
        margin-right: .5rem;
        &:last-child{
          margin-right: 0;
        }
        &:hover{
          color: $primary_color;
        }
        &.active{
          color: $custom_links_color;
          border-bottom: .1rem solid $custom_links_color;
        }
      }
    }
  }
  .comments__section{
    min-height: 5rem;
    overflow-y: auto;
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

  .profile__description {
    padding: .5rem 0;
  }

@media only screen and (max-width: 768px){
  .profile__description{padding-bottom: .5rem; font-size: .65rem;}
  .profile__page .edit__button{
    top: 0;
    transform: none;
  }
  .profile__page .profile__section .profile__info .profile__username{
    font-size: .5rem;
  }
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
