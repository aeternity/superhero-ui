<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <loading
      v-if="loading.initial"
      class="mt-5"
      :show-loading="true"
    />
    <div v-else>
      <div class="profile__page">
        <div class="actions-ribbon">
          <router-link :to="{ name: 'home' }">
            <img src="../assets/backArrow.svg">
          </router-link>
        </div>
        <div class="profile__section clearfix position-relative">
          <div
            v-if="showLoadingProfile"
            class="text-center spinner__container w-100"
          >
            <div
              class="spinner-border text-primary"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div
            class="row"
            :class="[showLoadingProfile ? 'invisible' : '']"
          >
            <div class="col-lg-12 col-md-12 col-sm-12 profile__editable position-relative">
              <a
                v-if="!editMode && isMyUserProfile"
                class="edit__button button small"
                title="Edit Profile"
                @click="toggleEditMode()"
              >
                Edit Profile
              </a>
              <div class="profile__image position-relative">
                <div
                  v-if="showLoadingAvatar"
                  class="overlay"
                />
                <loading
                  :show-loading="showLoadingAvatar && editMode"
                  class="position-absolute"
                />
                <label
                  v-if="editMode"
                  class="profile__image--edit"
                  :class="[showLoadingAvatar ? 'blurred' : '']"
                  :title="address"
                >
                  <img
                    :key="avatarEditImageKey"
                    :src="avatar"
                    :onerror="`this.className='fail'`"
                    alt=""
                  >
                  <span>Change Avatar</span>
                  <input
                    id="file-input"
                    type="file"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    @change="uploadImage($event)"
                  >
                </label>
                <a
                  v-else
                  :class="[showLoadingAvatar ? 'blurred' : '']"
                  :href="openExplorer(address)"
                  :title="address"
                  target="_blank"
                >
                  <img
                    v-if="!editMode"
                    :src="avatar"
                    :onerror="`this.className='fail'`"
                    alt=""
                  >
                </a>
              </div>
              <div class="profile__info">
                <h1
                  v-if="!editMode"
                  class="profile__displayname"
                >
                  {{ profile.displayName }}
                </h1>
                <!-- <div class="input-group" v-if="editMode">
                <input
                  type="text"
                  v-model="profile.displayName"
                  class="form-control"
                  placeholder="Edit Display Name"
                >
              </div> -->
                <a
                  v-if="!editMode"
                  class="profile__username"
                  target="_blank"
                  :href="openExplorer(address)"
                  :title="address"
                >
                  <span
                    v-if="userChainName"
                    class="chain"
                  >{{ userChainName }}</span>
                  <span v-else>{{ address }}</span>
                </a>
                <div
                  v-if="!editMode"
                  class="count"
                >
                  {{ userTips.length }} Tips
                </div>
              </div>
              <div
                v-if="!editMode"
                class="profile__description"
              >
                {{ profile.biography }}
              </div>
              <div
                v-if="editMode"
                class="input-group description"
              >
                <textarea
                  v-model="profile.biography"
                  class="form-control"
                  rows="3"
                  placeholder="Edit Biography"
                />
              </div>
              <div
                v-if="editMode"
                class="mt-2 mb-2"
              >
                <button
                  type="button"
                  class="btn btn-dark mr-2"
                  @click="resetEditedValues()"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-dark"
                  @click="saveProfile()"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="oracleState && tips && userStats"
            class="stats"
          >
            <div class="stat">
              <div class="stat-title">
                Tips Sent
              </div>
              <div class="stat-value">
                {{ userStats.tipsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                Retips Sent
              </div>
              <div class="stat-value">
                {{ userStats.retipsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                Total Sent Amount
              </div>
              <div class="stat-value">
                <ae-amount
                  :amount="userStats.totalTipAmount"
                  :round="2"
                />
                <fiat-value :amount="userStats.totalTipAmount" />
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                Comments
              </div>
              <div class="stat-value">
                {{ userStats.userComments }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                Claimed Urls
              </div>
              <div class="stat-value">
                {{ userStats.claimedUrlsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                Unclaimed Amount
              </div>
              <div class="stat-value">
                <ae-amount
                  :amount="userStats.unclaimedAmount"
                  :round="2"
                />
                <fiat-value :amount="userStats.unclaimedAmount" />
              </div>
            </div>
          </div>
        </div>
        <div class="profile__actions">
          <a
            :class="{ active: activeTab === 'tips' }"
            @click="setActiveTab('tips')"
          >Tips</a>
          <a
            :class="{ active: activeTab === 'comments' }"
            @click="setActiveTab('comments')"
          >
            Comments
          </a>
        </div>
        <div class="comments__section position-relative">
          <div
            v-if="showNoResultsMsg"
            class="no-results text-center w-100 mt-3"
            :class="[error ? 'error' : '']"
          >
            {{ 'There is no activity to display.' }}
          </div>
          <div
            v-if="activeTab === 'tips'"
            class="tips__container"
          >
            <div v-if="userTips.length">
              <tip-record
                v-for="(userTip,index) in userTips"
                :key="index"
                :tip="userTip"
                :fiat-value="userTip.fiatValue"
                :sender-link="openExplorer(userTip.sender)"
              />
            </div>
          </div>
          <div
            v-if="activeTab === 'comments'"
            class="tips__container"
          >
            <tip-comment
              v-for="(comment, index) in comments"
              :key="index"
              :user-chain-name="userChainName"
              :comment="comment"
              :sender-link="openExplorer(comment.author)"
            />
          </div>
          <div
            v-if="showLoading || loading.tips"
            class="mt-3"
          >
            <loading :show-loading="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import Backend from '../utils/backend';
import TipRecord from '../components/tipRecords/TipRecord.vue';
import TipComment from '../components/tipRecords/TipComment.vue';
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';
import { wallet } from '../utils/walletSearch';
import FiatValue from '../components/FiatValue.vue';
import AeAmount from '../components/AeAmount.vue';
import Util from '../utils/util';
import Loading from '../components/Loading.vue';
import defaultAvatar from '../assets/userAvatar.svg';
import { MIDDLEWARE_URL } from '../config/constants';

const backendInstance = new Backend();

export default {
  name: 'TipCommentsView',
  components: {
    Loading,
    AeAmount,
    FiatValue,
    TipComment,
    LeftSection,
    RightSection,
    TipRecord,
    MobileNavigation,
  },
  props: {
    address: { type: String, required: true },
  },
  data() {
    return {
      explorerUrl: `${MIDDLEWARE_URL}account/transactions/`,
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
      avatarEditImageKey: 0,
      profile: {
        biography: '',
        displayName: '',
      },
      defaultAvatar,
    };
  },
  computed: {
    ...mapGetters(['current', 'account', 'tips', 'oracleState', 'chainNames', 'loading']),
    userTips() {
      return this.tips.filter((tip) => tip.sender === this.address);
    },
    userStats() {
      const userReTips = this.tips
        .flatMap((tip) => tip.retips.filter((retip) => retip.sender === this.address));
      const totalTipAmount = Util.atomsToAe(this.userTips
        .reduce((acc, tip) => acc.plus(tip.amount), new BigNumber(0))
        .plus(userReTips.reduce((acc, tip) => acc.plus(tip.amount), new BigNumber(0)))).toFixed(2);

      const claimedUrls = this.oracleState.success_claimed_urls
        ? this.oracleState.success_claimed_urls
          .filter(([, data]) => data.success && data.account === this.address).map(([url]) => url)
        : [];
      const unclaimedAmount = this.tips
        .reduce((acc, tip) => (claimedUrls.includes(tip.url)
          ? acc.plus(tip.total_unclaimed_amount)
          : acc),
        new BigNumber(0));

      return {
        tipsLength: this.userTips.length,
        retipsLength: userReTips.length,
        totalTipAmount,
        claimedUrlsLength: claimedUrls.length,
        unclaimedAmount,
        userComments: this.userCommentCount,
      };
    },
    isMyUserProfile() {
      return this.account === this.address;
    },
    userChainName() {
      return this.chainNames[this.address];
    },
    showNoResultsMsg() {
      if (this.activeTab === 'comments') {
        return this.comments.length === 0 && !this.showLoading && !this.loading.tips;
      }
      return this.userTips.length === 0 && !this.showLoading && !this.loading.tips;
    },
    avatar() {
      const userImage = this.getAvatar(this.address);
      return userImage || this.defaultAvatar;
    },
  },
  async created() {
    this.getProfile();
    this.showLoading = true;
    backendInstance.getAllComments().then((allComments) => {
      this.showLoading = false;
      this.error = false;
      this.comments = allComments.filter((comment) => comment.author === this.address);
    }).catch((e) => {
      console.error(e);
      this.error = true;
      this.showLoading = false;
    });
  },
  methods: {
    updateAvatarImageKey() {
      this.avatarEditImageKey += 1;
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    openExplorer(address) {
      return this.explorerUrl + address;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    resetEditedValues() {
      this.getProfile();
      this.toggleEditMode();
    },
    async saveProfile() {
      const postData = {
        biography: this.profile.biography,
        author: wallet.client.rpcClient.getCurrentAccount(),
      };

      const response = await backendInstance.sendProfileData(postData);
      const signedChallenge = await wallet.signMessage(response.challenge);
      const respondChallenge = {
        challenge: response.challenge,
        signature: signedChallenge,
      };

      await backendInstance.sendProfileData(respondChallenge);
      this.resetEditedValues();
    },
    getProfile() {
      backendInstance.getCommentCountForAddress(this.address).then((userComment) => {
        this.userCommentCount = userComment.count;
      }).catch(console.error);

      backendInstance.getProfile(this.address).then((profile) => {
        this.profile = profile;
      }).catch(console.error);
    },
    getAvatar(address) {
      return Backend.getProfileImageUrl(address);
    },
    async uploadImage(event) {
      const data = new FormData();
      data.append('name', 'image');
      data.append('image', event.target.files[0]);

      const setImage = await backendInstance.setProfileImage(this.account, data);
      const signedChallenge = await wallet.signMessage(setImage.challenge);
      const respondChallenge = {
        challenge: setImage.challenge,
        signature: signedChallenge,
      };

      await backendInstance.setProfileImage(this.account, respondChallenge, false)
        .catch(console.error);

      // use the new avatar with cache-bust
      this.updateAvatarImageKey();
    },
  },
};
</script>


<style lang="scss" scoped>
  #file-input{
    display: none;
  }
  .profile__page{
    color: $light_font_color;
    font-size: .75rem;
    padding-top: .75rem;
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

    .profile__editable {
      align-items: center;
      display: flex;
    }

    .edit__button{
      position: absolute;
      top: -1.25rem;
      right: .5rem;
    }
    .profile__section{
      background-color: $actions_ribbon_background_color;
      .spinner__container{
        top: 40%;
      }
      .row{
        padding: 1.75rem 1rem 1rem 1rem;
        margin-right: -1rem;
      }
      .input-group.description{
        margin-bottom: 1rem;
      }
      .profile__image{
        margin-right: .5rem;
        vertical-align: super;
        .spinner__container{
          top: 30%;
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
        .profile__image--edit {
          cursor: pointer;
          display: flex;
          position: relative;

          span {
            align-items: center;
            color: $standard_font_color;
            display: flex;
            height: 100%;
            justify-content: center;
            position: absolute;
            text-align: center;
            top: 0;
            width: 100%;
          }
          img {
            opacity: .2;
          }

          &:hover {
            img {
              filter: grayscale(1);
            }
          }
        }
        img{
          width: 6.5rem;
          height: 6.5rem;
          border-radius: 3.25rem;
          object-fit: cover;
        }
      }
      .profile__image {
        display: flex;
      }
      .profile__info {
        width: calc(100% - 8.5rem);
        display: flex;
        flex-direction: column;

        .profile__displayname{
          font-size: 1.2rem;
          height: 1.5rem;
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
      position: sticky;
      z-index: 21;
      top: 2.1rem;
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

      .profile__actions {
        top: 3.3rem;
      }

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
        .profile__image{
          .spinner__container{
            top: 22%;
          }
          .profile__image--edit > div{
            top: 20%;
          }
          img{
            width: 4rem;
            height: 4rem;
          }
        }
      }
      .tips__container {
        padding: .15rem .5rem;
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
