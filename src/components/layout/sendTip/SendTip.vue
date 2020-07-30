<template>
  <div class="send-tip tip__post">
    <div v-if="open">
      <div class="tip__post__label clearfix">
        <img
          :title="$t('close')"
          class="close-sendform"
          src="../../../assets/iconClose.svg"
          @click="toggleSendTip(false)"
        >
      </div>
      <form @submit.prevent="sendTip">
        <MessageInput
          v-model="sendTipForm.title"
          maxlength="280"
          :placeholder="$t('addMessage')"
        />
        <div class="form-row">
          <div class="form-group col-md-5 col-lg-6 col-sm-12 send-url">
            <UrlStatus
              :url="sendTipForm.url"
              @is-blacklisted-url="isBlacklistedUrl = $event"
            />
            <input
              v-model.trim="sendTipForm.url"
              type="text"
              class="form-control url-input"
              :placeholder="$t('components.layout.SendTip.EnterURL')"
            >
          </div>
          <div class="send-amount">
            <AeInputAmount
              v-model="sendTipForm.amount"
              :select-token-f="(token) => inputToken = token"
            />
          </div>
          <div class="text-right">
            <AeButton
              :disabled="!canTip || !isSendTipDataValid"
              :loading="sendingTip"
              @click="sendTip"
            >
              <span class="text-nowrap">
                <IconDiamond /> {{ $t('tip') }}
              </span>
            </AeButton>
          </div>
        </div>
      </form>
    </div>
    <MessageInput
      v-else
      class="closed-view"
      :placeholder="$t('components.layout.SendTip.SendNewTip')"
      @focus="canTip ? toggleSendTip(true) : openTipDeeplink()"
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
import MessageInput from '../../MessageInput.vue';
import UrlStatus from './UrlStatus.vue';

export default {
  components: {
    AeInputAmount,
    AeButton,
    MessageInput,
    UrlStatus,
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
      open: false,
    };
  },
  computed: {
    ...mapGetters('backend', ['minTipAmount', 'isLoggedIn']),
    ...mapState(['loading', 'tokenInfo']),
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
  methods: {
    async sendTip() {
      this.sendingTip = true;
      // TODO differentiate between AE or token tip
      const isTokenTip = this.inputToken !== 'native';
      const amount = util.shiftDecimalPlaces(this.sendTipForm.amount,
        isTokenTip ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

      (isTokenTip
        ? tipToken(this.sendTipForm.url, this.sendTipForm.title, amount, this.inputToken)
        : tip(this.sendTipForm.url, this.sendTipForm.title, amount))
        .then(async () => {
          await Backend.cacheInvalidateTips().catch(console.error);
          this.clearTipForm();
          this.$store.dispatch('modals/open', {
            name: 'success',
            title: this.$t('components.layout.SendTip.SuccessHeader'),
            body: this.$t('components.layout.SendTip.SuccessText'),
          });
          setTimeout(() => EventBus.$emit('reloadData'), 5000);
        }).catch((e) => {
          this.sendingTip = false;
          if (e.code && e.code === 4) {
            return;
          }
          console.error(e);
          this.$store.dispatch('modals/open', {
            name: 'failure',
            title: this.$t('components.layout.SendTip.ErrorHeader'),
            body: this.$t('components.layout.SendTip.ErrorText'),
          });
        });
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

<style lang="scss" scoped>
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

    .send-url {
      background-color: $buttons_background;
      color: $standard_font_color;

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

      input {
        background-color: $buttons_background;
        color: $standard_font_color;
        font-size: 0.75rem;
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

    .send-url {
      position: relative;
    }

    .send-url,
    .send-amount {
      margin-bottom: 1rem;
    }

    .tip__post__balance span {
      font-size: 0.75rem;
      color: $standard_font_color;
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
      left: 0.55rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .url-input {
      padding-left: 2.1rem;
      &:focus {
        box-shadow: none;
      }
    }

    .closed-view.message-input {
      padding: 1rem;

      textarea::placeholder {
        color: $standard_font_color;
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
        padding: 0 0.25rem;
      }

      .col-md-2 {
        padding: 0;
      }
    }
  }
</style>
