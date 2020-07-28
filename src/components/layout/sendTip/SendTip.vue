<template>
  <div class="send-tip tip__post">
    <div v-if="open && !error && !success">
      <div class="tip__post__label clearfix">
        <img
          :title="$t('close')"
          class="close-sendform"
          src="../../../assets/iconClose.svg"
          @click="toggleSendTip(false)"
        >
      </div>
      <form @submit.prevent>
        <div class="form-group">
          <Avatar
            :address="account"
            class="avatar mr-3"
          />
          <span class="message-box">
            <input
              v-model="sendTipForm.title"
              type="text"
              class="form-control comment"
              maxlength="280"
              :placeholder="$t('addMessage')"
            >
            <span class="message-carret" />
          </span>
        </div>
        <div class="form-row">
          <div class="form-group col-md-5 col-lg-6 col-sm-12 send-url">
            <UrlStatus
              :url="sendTipForm.url"
              class="url-status"
            />
            <input
              v-model.trim="sendTipForm.url"
              type="text"
              class="form-control url-input"
              :placeholder="$t('components.layout.SendTip.EnterURL')"
            >
          </div>
          <div class="col-lg-4 col-md-5 col-sm-12 send-amount">
            <AeInputAmount
              v-model="sendTipForm.amount"
              :select-token-f="(token) => inputToken = token"
            />
          </div>
          <div class="col-lg-2 col-md-2 col-sm-12">
            <div class="text-right">
              <AeButton
                :disabled="!canTip || !isSendTipDataValid"
                :loading="sendingTip"
                @click="sendTip"
              >
                <IconDiamond /> {{ $t('tip') }}
              </AeButton>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div
      v-else-if="!open && !error && !success"
      class="closed-view"
      @click="canTip ? toggleSendTip(true) : openTipDeeplink()"
    >
      <div class="form-group">
        <Avatar
          :address="account"
          class="avatar mr-3"
        />
        <span class="message-box">
          <input
            type="text"
            class="form-control comment input-placeholder"
            :placeholder="$t('components.layout.SendTip.SendNewTip')"
            disabled
          >
          <span class="message-carret" />
        </span>
        <div class="closed-overlay" />
      </div>
    </div>
    <SendTipStatusMsg
      v-else
      :status="success"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { tip, tipToken } from '@/utils/aeternity';
import { EventBus } from '@/utils/eventBus';
import AeInputAmount from '../../AeInputAmount.vue';
import util, { createDeepLinkUrl } from '../../../utils/util';
import Backend from '../../../utils/backend';
import AeButton from '../../AeButton.vue';
import IconDiamond from '../../../assets/iconDiamond.svg?icon-component';
import Avatar from '../../Avatar.vue';
import UrlStatus from './UrlStatus.vue';
import SendTipStatusMsg from './SendTipStatusMsg.vue';

export default {
  name: 'SendTip',
  components: {
    AeInputAmount,
    AeButton,
    Avatar,
    UrlStatus,
    SendTipStatusMsg,
    IconDiamond,
  },
  data() {
    return {
      inputToken: 'native',
      sendTipForm: {
        amount: 0,
        url: '',
        title: '',
      },
      sendingTip: false,
      isBlacklistedUrl: false,
      success: false,
      error: false,
      open: false,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['loading', 'account', 'minTipAmount', 'tokenInfo']),
    isSendTipDataValid() {
      const urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/g;
      // TODO: better validation
      return this.sendTipForm.amount > this.minTipAmount
          && this.sendTipForm.url.length > 0
          && this.sendTipForm.title.length > 0
          && urlRegex.test(this.sendTipForm.url)
          && !this.isBlacklistedUrl;
    },
    canTip() {
      return this.isLoggedIn && !this.loading.wallet;
    },
  },
  async created() {
    EventBus.$on('blacklistedUrl', (payload) => {
      this.isBlacklistedUrl = payload;
    });
  },
  methods: {
    async sendTip() {
      this.sendingTip = true;
      this.resetStatuses();

      const isTokenTip = this.inputToken !== 'native';
      const amount = util.shiftDecimalPlaces(this.sendTipForm.amount,
        isTokenTip ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

      (isTokenTip
        ? tipToken(this.sendTipForm.url, this.sendTipForm.title, amount, this.inputToken)
        : tip(this.sendTipForm.url, this.sendTipForm.title, amount))
        .then(async () => {
          await Backend.cacheInvalidateTips().catch(console.error);
          this.clearTipForm();
          EventBus.$emit('reloadData');
          this.showSuccessMsg();
        }).catch((e) => {
          this.sendingTip = false;
          if (e.code && e.code === 4) {
            return;
          }
          console.error(e);
          this.showErrorMsg();
        });
    },
    showStatusMsg() {
      setTimeout(() => {
        this.resetStatuses();
      }, 3000);
    },
    showErrorMsg() {
      this.error = true;
      this.success = false;
      this.showStatusMsg();
    },
    showSuccessMsg() {
      this.success = true;
      this.error = false;
      this.showStatusMsg();
    },
    resetStatuses() {
      this.error = false;
      this.success = false;
    },
    clearTipForm() {
      this.sendTipForm = { amount: 0, url: '', title: '' };
      this.sendingTip = false;
    },
    toggleSendTip(openSection) {
      this.open = openSection;
      this.clearTipForm();
    },
    openTipDeeplink() {
      window.location = createDeepLinkUrl({ type: 'tip' });
    },
  },
};
</script>

<style lang="scss">
  .tip__post {
    background-color: $actions_ribbon_background_color;
    max-height: 400px;

    form {
      padding: 0.6rem 1rem 0 1rem;
    }

    .form-row {
      margin-top: 1rem;

      .form-group {
        border: 0.05rem solid $buttons_background;
        border-radius: 0.25rem;
        padding: 0;

        input,
        input:focus {
          border: 0;
        }

        &:focus-within {
          border-color: $secondary_color;
        }
      }

      .col-md-4 {
        padding-right: 0;
      }
    }

    .form-group {
      margin-bottom: 0;

      input {
        &.comment {
          display: inline-block;
          width: calc(100% - 3.01rem);
        }

        background-color: $buttons_background;
        color: $standard_font_color;
        font-size: 0.75rem;
        height: 2.2rem;
      }
    }

    .send-url,
    .send-amount {
      margin-bottom: 1rem;
    }

    .tip__post__balance span {
      font-size: 0.75rem;
      color: $standard_font_color;
    }

    .avatar,
    .user-identicon svg {
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
    }

    .avatar {
      vertical-align: middle;
    }

    .tip__post__label {
      font-weight: 600;
      font-size: 0.8rem;
      color: $standard_font_color;
      padding: 0.375rem 0.5rem;
      background-color: $light_color;

      label {
        margin-bottom: 0;
      }
    }

    .url-status {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-60%);
    }

    .url-input {
      padding-left: 2.1rem;
    }

    .closed-view {
      padding: 1rem;
      position: relative;

      &:hover {
        cursor: pointer;
      }
    }

    .closed-overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }

    .input-placeholder[disabled] {
      &::placeholder {
        color: $standard_font_color;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .close-sendform {
      width: 0.65rem;
      float: right;

      &:hover {
        cursor: pointer;
        opacity: 0.6;
      }
    }

    .ae-button {
      width: 100%;
      height: 2.2rem;
      margin-top: 0.05rem;
      margin-bottom: 1rem;

      svg {
        height: 1.1em;
      }
    }

    .message-box {
      position: relative;
    }

    .message-carret {
      top: 0.1rem;
      left: -0.4rem;
    }

    @media (min-width: 576px) {
      .send-url,
      .send-amount,
      .col-md-2 {
        padding: 0;
      }
    }

    @media (min-width: 768px) {
      .send-url,
      .send-amount {
        padding-right: 0.25rem;
        padding-left: 0.25rem;
      }

      .col-md-2 {
        padding: 0;
      }
    }
  }
</style>
