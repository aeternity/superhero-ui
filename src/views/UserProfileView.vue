<template>
  <div>
    <right-section></right-section>
    <left-section></left-section>
    <loading class="mt-5" v-if="loading.wallet || loading.initial" :show-loading="true"/>
    <div v-else>
    <div class="container profile__page">
      <div class="profile__section clearfix position-relative">
        <div class="text-center spinner__container w-100" v-if="showLoadingProfile">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="row" :class="[showLoadingProfile ? 'invisible' : '']">
          <div class="col-lg-12 col-md-12 col-sm-12 profile__editable position-relative">
            <a class="edit__button button small" @click="toggleEditMode()" v-if="!editMode && isMyUserProfile" title="Edit Profile">Edit Profile</a>
            <div class="profile__image position-relative" >
              <div class="overlay" v-if="showLoadingAvatar"></div>
              <div class="text-center spinner__container w-100" v-if="showLoadingAvatar">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <label for="file-input" v-if="editMode" class="position-relative profile__image--edit" :class="[showLoadingAvatar ? 'blurred' : '']">
                <a :href="openExplorer(address)" target="_blank" v-if="!editMode" :title="address">
                  <img :src="avatar"/>
                </a>
                <div>Change Avatar</div>
              </label>
              <div :class="[showLoadingAvatar ? 'blurred' : '']">
                <img :src="avatar" v-if="!editMode">
              </div>
              <input id="file-input" type="file" name="avatar" @change="uploadImage($event)" v-if="editMode" accept="image/png, image/jpeg">
            </div>
            <div class="profile__info">
              <!-- <h1 class="profile__displayname" v-if="!editMode">{{profile.displayName}}</h1>
              <div class="input-group" v-if="editMode">
                <input type="text" v-model="profile.displayName" class="form-control" placeholder="Edit Display Name">
              </div> -->
              <a class="profile__username" target="_blank" :href="openExplorer(address)" v-if="!editMode" :title="address">
                <span class="chain"  v-if="userChainName">{{userChainName}}</span>
                <span v-else>{{address}}</span>
              </a>
              <div class="count" v-if="!editMode">{{userTips.length}} Tips</div>
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

        <div class="stats" v-if="oracleState && tips && userStats">
          <div class="stat">
            <div class="stat-title">Tips Sent</div>
            <div class="stat-value">{{userStats.tipsLength}}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Retips Sent</div>
            <div class="stat-value">{{userStats.retipsLength}}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Total Sent Amount</div>
            <div class="stat-value">{{userStats.totalTipAmount}} AE<fiat-value :amount="userStats.totalTipAmount" /></div>
          </div>
          <div class="stat">
            <div class="stat-title">Comments</div>
            <div class="stat-value">{{userStats.userComments}}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Claimed Urls</div>
            <div class="stat-value">{{userStats.claimedUrlsLength}}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Unclaimed Amount</div>
            <div class="stat-value">{{userStats.unclaimedAmount}} AE<fiat-value :amount="userStats.unclaimedAmount" /></div>
          </div>
        </div>

      </div>
        <div class="profile__actions">
          <a :class="{ active: activeTab === 'tips' }" @click="setActiveTab('tips')">Tips</a>
          <a :class="{ active: activeTab === 'comments' }" @click="setActiveTab('comments')">Comments</a>
        </div>
      <div class="comments__section position-relative">
        <div class="no-results text-center w-100 mt-3" :class="[error ? 'error' : '']" v-if="showNoResultsMsg">{{'There is no activity to display.'}}</div>
          <div v-if="activeTab === 'tips'">
            <div v-if="userTips.length">
              <tip-record v-for="(tip,index) in userTips"
                :key="index"
                :tip="tip"
                :fiatValue="tip.fiatValue"
                :senderLink="openExplorer(tip.sender)">
              </tip-record>
            </div>
          </div>
          <div v-if="activeTab === 'comments'">
            <tip-comment v-for="(comment, index) in comments" :key="index" :userChainName="userChainName"  :comment="comment" :senderLink="openExplorer(comment.author)"></tip-comment>
          </div>
        <div class="mt-3" v-if="showLoading || loading.tips">
          <loading :show-loading="true" />
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
  import LeftSection from '../components/layout/LeftSection.vue';
  import RightSection from '../components/layout/RightSection.vue';
  import { mapGetters } from 'vuex';
  import { wallet } from '../utils/walletSearch';
  import FiatValue from "../components/FiatValue";
  import BigNumber from 'bignumber.js';
  import Util from '../utils/util';
  import Loading from "../components/Loading";
  import avatar from '../assets/userAvatar.svg';

  const backendInstance = new Backend();

  export default {
    props: ['address'],
    name: 'TipCommentsView',
    components: {
      Loading,
      FiatValue,
      TipComment,
      LeftSection,
      RightSection,
      TipRecord
    },
     data() {
      return {
        explorerUrl: 'https://mainnet.aeternal.io/account/transactions/',
        tip: this.tipData,
        showLoading: false,
        comments: [],
        error: false,
        userName: this.address,
        editingDisplayName: '',
        editingDescription: '',
        editMode: false,
        showLoadingProfile: false,
        showLoadingAvatar: false,
        activeTab: 'tips',
        userCommentCount: 0,
        profile: {
          biography: '',
          displayName: '',
          image: false,
        },
        avatar,
        BACKEND_URL : "https://raendom-backend.z52da5wt.xyz",
      }
    },
    computed: {
      ...mapGetters(['current', 'account', 'tips', 'oracleState', 'chainNames', 'loading']),
      userTips() {
        return this.tips.filter(tip => tip.sender === this.address);
      },
      userStats() {
        const userReTips = this.tips.flatMap(tip => tip.retips.filter(retip => retip.sender === this.address));
        const totalTipAmount = Util.atomsToAe(this.userTips
          .reduce((acc, tip) => acc.plus(tip.amount), new BigNumber(0))
          .plus(userReTips.reduce((acc, tip) => acc.plus(tip.amount), new BigNumber(0)))).toFixed(2);

        const claimedUrls = this.oracleState.success_claimed_urls ? this.oracleState.success_claimed_urls.filter(([_, data]) => data.success && data.account === this.address).map(([url]) => url) : [];
        const unclaimedAmount = this.tips.reduce((acc, tip) => claimedUrls.includes(tip.url) ? acc.plus(tip.total_unclaimed_amount) : acc, new BigNumber(0));

        return {
          tipsLength: this.userTips.length,
          retipsLength: userReTips.length,
          totalTipAmount: totalTipAmount,
          claimedUrlsLength: claimedUrls.length,
          unclaimedAmount : unclaimedAmount,
          userComments : this.userCommentCount
        };
      },
      isMyUserProfile() {
        return this.account === this.address;
      },
      userChainName(){
        return this.chainNames[this.address];
      },
      showNoResultsMsg() {
        if (this.activeTab === 'comments') {
          return this.comments.length === 0 && !this.showLoading && !this.loading.tips
        } else {
          return this.userTips.length === 0 && !this.showLoading && !this.loading.tips
        }
      }
    },
    methods: {
      setActiveTab(tab){
        this.activeTab = tab;
      },
      openExplorer(address) {
        return this.explorerUrl + address
      },
      toggleEditMode(){
        this.editMode = !this.editMode;
      },
      resetEditedValues(){
        this.getProfile();
        this.toggleEditMode();
      },
      async saveProfile() {
        let postData = {
          biography: this.profile.biography,
          author: wallet.client.rpcClient.getCurrentAccount(),
        };

        const response = await backendInstance.sendProfileData(postData);
        let signedChallenge = await wallet.signMessage(response.challenge);
        let respondChallenge = {
          challenge: response.challenge,
          signature: signedChallenge
        };

        await backendInstance.sendProfileData(respondChallenge);
        this.resetEditedValues();
      },
      getProfile() {
        backendInstance.getCommentCountForAddress(this.address).then(userComment => {
          this.userCommentCount = userComment.count
        }).catch(console.error);

        backendInstance.getProfile(this.address).then(profile => {
          this.profile = profile;
          if (profile.image) {
            this.avatar = `${this.BACKEND_URL}/profile/image/${this.address}`;
          }
        })
        .catch(console.error);
      },
      uploadImage(event) {
        let data = new FormData();
        data.append('image', event.target.files[0]);

        backendInstance.setProfileImage(this.account, data, true)
          .then(async (response) => {
            let signedChallenge = await wallet.signMessage(response.challenge)
            let respondChallenge = {
              challenge: response.challenge,
              signature: signedChallenge
            }
            backendInstance.setProfileImage(this.account, respondChallenge, false)
              .then((result) => {
                console.log(result);
            }).catch(console.error)
        })
      },
    },
   async created(){
      this.getProfile();
      this.showLoading = true;
      backendInstance.getAllComments().then(allComments => {
        this.showLoading = false;
        this.error = false;
        this.comments = allComments.filter(comment => comment.author === this.address);
      }).catch(e => {
        console.error(e);
        this.error = true;
        this.showLoading = false;
      });
    }
  }
</script>


<style lang="scss" scoped>
  #file-input{
    display: none;
  }
  .profile__page{
    margin-top: .125rem;
    .count{
      font-size: .65rem;
    }
    .stats {
      display: grid;
      grid-template-columns: auto auto auto;
      background-color: $light_color;
      padding: .5rem 1rem .5rem 1rem;

      .stat {
        padding: .5rem;

        .stat-title {
          font-size: .7rem;
          font-weight: 600;
          color: $tip_note_color;
        }

        .stat-value {
          font-size: .9rem;
          color: $secondary_color;
          font-weight: 400;
        }
      }
    }

    .edit__button{
      position: absolute;
      top: -1.25rem;
      right: .5rem;
    }
    color: $light_font_color;
    font-size: .75rem;
    .profile__section{
      background-color: $actions_ribbon_background_color;
      .spinner__container{
        top: 40%;
      }
      .row{
        padding: 1.75rem 1rem 1rem 1rem;
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
          width: 6.5rem;
          height: 6.5rem;
          border-radius: 3.25rem;
        }
      }
      .profile__info, .profile__image{
        display: inline-block;
      }
      .profile__info{
        width: calc(100% - 8.5rem);
        .profile__displayname{
          font-size: 1.2rem;
        }
        .profile__username, .profile__displayname{
          margin-bottom: 0;
        }
        .profile__username{
          display: block;
          color: $tip_note_color;
          font-size: .6rem;
          word-break: break-all;
          font-weight: 400;
          .chain{
            font-size: .8rem;
          }
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
          cursor: pointer;
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
    .comment.tip__record{
      border-radius: unset;
    }
  }

  .no-results{
    color: $standard_font_color;
    font-size: .75rem;
    text-align: center;
    &.error{
      color: red;
    }
  }

  .profile__description {
    padding: .5rem 0;
    color: $tip_note_color;
  }

@media only screen and (max-width: 768px){
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

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
    .profile__page{
      .profile__section{
        .row{
          padding-top: 2rem;
        }
        .profile__info {
          width: calc(100% - 4.5rem);
          vertical-align: middle;
          .profile__username {
            font-size: .5rem;
            .chain{
              font-size: .6rem;
            }
          }
        } 
        .profile__image img{
          width: 4rem;
          height: 4rem;
        }
      }
      .edit__button{
        top: -1.5rem;
        right: .25rem;
        font-size: .6rem;
      }
      .stats .stat .stat-value{
        font-size: .6rem;
      }
    }
  }
</style>
