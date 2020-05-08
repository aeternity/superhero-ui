<template>
  <Page>
    <Loading
      v-if="loading.initial"
      class="mt-5"
    />
    <div v-else>
      <div class="profile__page">
        <BackButtonRibbon />
        <div class="profile__section clearfix position-relative">
          <div
            v-if="showLoadingProfile"
            class="text-center spinner__container w-100"
          >
            <div
              class="spinner-border text-primary"
              role="status"
            >
              <span class="sr-only">{{ $t('loading') }}</span>
            </div>
          </div>
          <div
            class="row"
            :class="[showLoadingProfile ? 'invisible' : '']"
          >
            <div class="col-lg-12 col-md-12 col-sm-12 profile__editable position-relative">
              <a
                v-if="!editMode && account === address"
                class="edit__button button small"
                title="Edit Profile"
                @click="toggleEditMode"
              >
                {{ $t('views.UserProfileView.EditProfile') }}
              </a>
              <div class="profile__image position-relative">
                <div
                  v-if="showLoadingAvatar"
                  class="overlay"
                />
                <Loading
                  v-if="showLoadingAvatar && editMode"
                  class="position-absolute"
                />
                <label
                  v-if="editMode"
                  class="profile__image--edit"
                  :class="[showLoadingAvatar ? 'blurred' : '']"
                  :title="address"
                >
                  <Avatar
                    :key="avatarEditImageKey"
                    :address="address"
                  />
                  <span>{{ $t('views.UserProfileView.ChangeAvatar') }}</span>
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
                  <Avatar
                    :key="!editMode"
                    :address="address"
                  />
                </a>
              </div>
              <div
                v-if="!editMode"
                class="profile__info"
              >
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
                </div>-->
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
                  >
                    {{ userChainName }}
                  </span>
                  <span v-else>{{ address }}</span>
                </a>
                <div
                  v-if="!editMode && userStats"
                  class="count"
                >
                  {{ userStats.tipsLength }} {{ $t('tips') }}
                </div>
                <TipInput
                  v-if="!editMode"
                  :user-address="address"
                  class="tip__user"
                />
              </div>
            </div>
            <div
              v-if="editMode"
              class="input-group delete-avatar"
            >
              <span @click="deleteAvatar">
                {{ $t('views.UserProfileView.DeleteAvatar') }}
              </span>
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
                :placeholder="$t('views.UserProfileView.EditBiography')"
              />
            </div>
            <div
              v-if="editMode"
              class="edit__buttons"
            >
              <button
                type="button"
                class="button small"
                @click="resetEditedValues"
              >
                {{ $t('cancel') }}
              </button>
              <button
                type="button"
                class="button small primary"
                @click="saveProfile"
              >
                {{ $t('views.UserProfileView.Save') }}
              </button>
            </div>
          </div>

          <div
            v-if="userStats"
            class="stats"
          >
            <div class="stat">
              <div class="stat-title">
                {{ $t('views.UserProfileView.TipsSent') }}
              </div>
              <div class="stat-value">
                {{ userStats.tipsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                {{ $t('views.UserProfileView.RetipsSent') }}
              </div>
              <div class="stat-value">
                {{ userStats.retipsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                {{ $t('views.UserProfileView.TotalSentAmount') }}
              </div>
              <AeAmountFiat
                class="stat-value"
                :amount="userStats.totalTipAmount"
              />
            </div>
            <div class="stat">
              <div class="stat-title">
                {{ $t('comments') }}
              </div>
              <div class="stat-value">
                {{ userStats.userComments }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                {{ $t('views.UserProfileView.ClaimedUrls') }}
              </div>
              <div class="stat-value">
                {{ userStats.claimedUrlsLength }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">
                {{ $t('views.UserProfileView.UnclaimedAmount') }}
              </div>
              <AeAmountFiat
                class="stat-value"
                :amount="userStats.unclaimedAmount"
              />
            </div>
          </div>
        </div>
        <div class="profile__actions">
          <a
            :class="{ active: activeTab === 'tips' }"
            @click="setActiveTab('tips')"
          >
            {{ $t('tips') }}
          </a>
          <a
            :class="{ active: activeTab === 'comments' }"
            @click="setActiveTab('comments')"
          >
            {{ $t('comments') }}
          </a>
        </div>
        <div class="comments__section position-relative">
          <div
            v-if="activeTab === 'tips'"
            class="tips__container"
          >
            <TipsPagination
              tip-sort-by="latest"
              :address="address"
            />
          </div>
          <div
            v-if="activeTab === 'comments'"
            class="tips__container"
          >
            <div
              v-if="showNoResultsMsg"
              class="no-results text-center w-100 mt-3"
              :class="[error ? 'error' : '']"
            >
              {{ $t('views.UserProfileView.NoActivity') }}
            </div>
            <TipComment
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
            <Loading />
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import Backend from '../utils/backend';
import TipComment from '../components/tipRecords/TipComment.vue';
import Page from '../components/layout/Page.vue';
import { wallet } from '../utils/walletSearch';
import AeAmountFiat from '../components/AeAmountFiat.vue';
import Loading from '../components/Loading.vue';
import { EXPLORER_URL } from '../config/constants';
import TipsPagination from '../components/TipsPagination.vue';
import Avatar from '../components/Avatar.vue';
import BackButtonRibbon from '../components/BackButtonRibbon.vue';
import { EventBus } from '../utils/eventBus';
import TipInput from '../components/TipInput.vue';

export default {
  name: 'TipCommentsView',
  components: {
    TipsPagination,
    Loading,
    AeAmountFiat,
    TipComment,
    Page,
    Avatar,
    BackButtonRibbon,
    TipInput,
  },
  props: {
    address: { type: String, required: true },
  },
  data() {
    return {
      explorerUrl: `${EXPLORER_URL}account/transactions/`,
      tip: this.tipData,
      showLoading: false,
      comments: [],
      error: false,
      userStats: null,
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
    };
  },
  computed: {
    ...mapGetters(['account', 'chainNames', 'loading']),
    userChainName() {
      return this.chainNames[this.address];
    },
    showNoResultsMsg() {
      if (this.activeTab === 'comments') {
        return (
          this.comments.length === 0 && !this.showLoading && !this.loading.tips
        );
      }
      return false;
    },
  },
  mounted() {
    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  async created() {
    this.reloadData();
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

      const response = await Backend.sendProfileData(postData);
      const signedChallenge = await wallet.signMessage(response.challenge);
      const respondChallenge = {
        challenge: response.challenge,
        signature: signedChallenge,
      };

      await Backend.sendProfileData(respondChallenge);
      this.resetEditedValues();
    },
    async deleteAvatar() {
      const response = await Backend.deleteProfileImage(this.account);
      const signedChallenge = await wallet.signMessage(response.challenge);
      const respondChallenge = {
        challenge: response.challenge,
        signature: signedChallenge,
      };

      await Backend.deleteProfileImage(this.account, respondChallenge).catch(console.error);

      this.resetEditedValues();

      // use the new avatar with cache-bust
      this.updateAvatarImageKey();
    },
    reloadData() {
      this.getProfile();
      Backend.getCacheUserStats(this.address).then((stats) => {
        this.userStats = stats;
      });
      this.showLoading = true;
      Backend.getAllComments()
        .then((allComments) => {
          this.showLoading = false;
          this.error = false;
          this.comments = allComments.filter(
            (comment) => comment.author === this.address,
          );
        })
        .catch((e) => {
          console.error(e);
          this.error = true;
          this.showLoading = false;
        });
    },
    getProfile() {
      Backend.getCommentCountForAddress(this.address)
        .then((userComment) => {
          this.userCommentCount = userComment.count;
        })
        .catch(console.error);

      Backend.getProfile(this.address)
        .then((profile) => {
          this.profile = profile;
        })
        .catch(console.error);
    },
    async uploadImage(event) {
      const data = new FormData();
      data.append('name', 'image');
      data.append('image', event.target.files[0]);

      const setImage = await Backend.setProfileImage(this.account, data);
      const signedChallenge = await wallet.signMessage(setImage.challenge);
      const respondChallenge = {
        challenge: setImage.challenge,
        signature: signedChallenge,
      };

      await Backend.setProfileImage(
        this.account,
        respondChallenge,
        false,
      ).catch(console.error);

      // use the new avatar with cache-bust
      this.updateAvatarImageKey();
    },
  },
};
</script>

<style lang="scss">
#file-input {
  display: none;
}

.profile__page {
  color: $light_font_color;
  font-size: 0.75rem;

  .count {
    font-size: 0.65rem;
  }

  .stats {
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: $light_color;
    padding: 0.5rem 1rem 0.5rem 1rem;

    .stat {
      padding: 0.5rem;

      .stat-title {
        font-size: 0.7rem;
        font-weight: 600;
        color: $tip_note_color;
      }

      .stat-value,
      .stat-value /deep/ .currency-value {
        font-size: 0.9rem;
        color: $secondary_color;
        font-weight: 400;
      }
    }
  }

  .edit__buttons {
    margin: 0.5rem 1rem;

    button {
      margin-right: 0.75rem;
    }
  }

  .profile__editable {
    align-items: center;
    display: flex;
  }

  .edit__button {
    position: absolute;
    top: -1.25rem;
    right: 0.5rem;
  }

  .profile__section {
    background-color: $actions_ribbon_background_color;

    .spinner__container {
      top: 40%;
    }

    .row {
      padding: 1.75rem 1rem 1rem 1rem;
      margin-right: -1rem;
    }

    .input-group.delete-avatar {
      margin-left: 1rem;

      span {
        &:hover {
          color: white;
          cursor: pointer;
        }
      }
    }

    .input-group.description {
      margin-bottom: 1rem;
    }

    .profile__image {
      display: flex;
      margin-right: 0.5rem;
      vertical-align: super;

      .spinner__container {
        top: 30%;
      }

      .blurred {
        opacity: 0.4;
      }

      .input-group.description {
        margin: 0.5rem 1rem;

        textarea {
          min-height: 4rem;
        }
      }

      .overlay {
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

        img,
        .user-identicon svg {
          opacity: 0.2;
        }

        &:hover {
          img,
          .user-identicon svg {
            filter: grayscale(1);
          }
        }
      }

      img,
      .user-identicon svg {
        width: 6.5rem;
        height: 6.5rem;
        border-radius: 3.25rem;
        object-fit: cover;
      }
    }

    .profile__info {
      width: calc(100% - 8.5rem);
      display: flex;
      flex-direction: column;

      .profile__displayname {
        font-size: 1.2rem;
        height: 1.5rem;
      }

      .profile__username,
      .profile__displayname {
        margin-bottom: 0;
      }

      .profile__username {
        display: block;
        color: $tip_note_color;
        font-size: 0.6rem;
        word-break: break-all;
        font-weight: 400;

        .chain {
          font-size: 0.8rem;
        }
      }
    }

    .description {
      margin: 0.5rem 1rem;

      textarea {
        min-height: 4rem;
      }
    }

    .profile__description {
      margin: 0.5rem 1rem;
      color: $tip_note_color;
    }
  }

  .profile__meta {
    font-size: 0.6rem;
    background-color: $thumbnail_background_color;
    margin: -0.5rem 0 -1rem 0;
    border-top-right-radius: 0.25rem;
    padding: 0;

    & > .row.mobile {
      display: none;
    }
  }

  .profile__actions {
    padding-left: 1rem;
    margin-top: 0.125rem;
    background-color: $actions_ribbon_background_color;
    position: sticky;
    z-index: 21;
    top: 3.1rem;

    a {
      font-weight: 600;
      color: $light_font_color;
      padding: 0.5rem;
      display: inline-block;
      margin-right: 0.5rem;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        color: $primary_color;
        cursor: pointer;
      }

      &.active {
        color: $custom_links_color;
        border-bottom: 0.1rem solid $custom_links_color;
      }
    }
  }

  .comments__section {
    min-height: 5rem;

    .comment.tip__record {
      border-radius: unset;
    }
  }

  .no-results {
    color: $standard_font_color;
    font-size: 0.75rem;
    text-align: center;

    &.error {
      color: red;
    }
  }
}

@media only screen and (max-width: 768px) {
  .profile__page .profile__meta {
    margin-top: 0;
    border-top-right-radius: 0;
  }

  .profile__page .profile__section > .row {
    padding-left: 0.75rem;
  }

  .profile__page .profile__meta > .row {
    display: none;

    &.mobile {
      display: flex;
      padding-bottom: 0;

      & .row {
        padding-bottom: 0.5rem;
        padding-top: 0;
      }
    }
  }
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .profile__page {
    .profile__actions {
      top: 3rem;
    }

    .profile__section {
      .row {
        padding-top: 2rem;
      }

      .profile__info {
        width: calc(100% - 4.5rem);
        vertical-align: middle;

        .profile__username {
          font-size: 0.5rem;

          .chain {
            font-size: 0.6rem;
          }
        }
      }

      .profile__image {
        .spinner__container {
          top: 22%;
        }

        .profile__image--edit > div {
          top: 20%;
        }

        img {
          width: 4rem;
          height: 4rem;
        }
      }
    }

    .tips__container {
      padding: 0.15rem 0.5rem;
    }

    .edit__button {
      top: -1.5rem;
      right: 0.25rem;
      font-size: 0.6rem;
    }

    .tip__user {
      top: -1.25rem;
      right: 6rem;
    }

    .stats .stat .stat-value {
      font-size: 0.6rem;
    }
  }
}
</style>
