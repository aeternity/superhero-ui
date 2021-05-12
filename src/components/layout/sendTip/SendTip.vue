<template>
  <div class="send-tip tip-post">
    <div v-if="showForm">
      <div class="tip-post-label clearfix">
        <IconClose
          :title="$t('close')"
          class="close-sendform"
          @click="toggleForm"
        />
      </div>
      <SendPost v-if="post" />
      <form
        v-else
        @submit.prevent="sendTip"
      >
        <MessageInput
          v-model="sendTipForm.title"
          maxlength="280"
          :placeholder="$t('addMessage')"
        />
        <div class="mt-2 d-flex flex-row">
          <div class="send-url">
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
              :disabled="!isSendTipDataValid"
              :loading="sendingTip"
              class="text-nowrap"
            >
              <IconDiamond /> {{ $t('tip') }}
            </AeButton>
          </div>
        </div>
      </form>
    </div>
    <MessageInput
      v-else
      class="closed-view"
      :placeholder="post ?
        'Create New Post' :
        $t('components.layout.SendTip.SendNewTip')"
      @focus="useSdkWallet ? toggleForm() : openTipDeeplink()"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AeInputAmount from '../../AeInputAmount.vue';
import { createDeepLinkUrl, shiftDecimalPlaces, validateTipUrl } from '../../../utils';
import { EventBus } from '../../../utils/eventBus';
import Backend from '../../../utils/backend';
import AeButton from '../../AeButton.vue';
import IconDiamond from '../../../assets/iconDiamond.svg?icon-component';
import IconClose from '../../../assets/iconClose.svg?icon-component';
import MessageInput from '../../MessageInput.vue';
import UrlStatus from './UrlStatus.vue';
import SendPost from './SendPost.vue';

export default {
  components: {
    AeInputAmount,
    AeButton,
    MessageInput,
    UrlStatus,
    IconDiamond,
    IconClose,
    SendPost,
  },
  props: { post: Boolean },
  data() {
    return {
      inputToken: null,
      sendTipForm: {
        amount: 0,
        url: '',
        title: '',
      },
      sendingTip: false,
      isBlacklistedUrl: false,
      showForm: false,
    };
  },
  computed: {
    ...mapGetters('backend', ['minTipAmount']),
    ...mapState(['tokenInfo']),
    ...mapState('aeternity', ['useSdkWallet']),

    isTipAmountValid() {
      return this.inputToken !== null || (this.sendTipForm.amount > this.minTipAmount);
    },
    isSendTipDataValid() {
      // TODO: better validation
      return this.isTipAmountValid
          && this.sendTipForm.url.length > 0
          && this.sendTipForm.title.length > 0
          && validateTipUrl(this.sendTipForm.url)
          && !this.isBlacklistedUrl;
    },
  },
  methods: {
    async sendTip() {
      this.sendingTip = true;
      const amount = shiftDecimalPlaces(this.sendTipForm.amount,
        this.inputToken !== null ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

      this.$store.dispatch('aeternity/tip', {
        url: this.sendTipForm.url,
        title: this.sendTipForm.title,
        amount,
        tokenAddress: this.inputToken,
      })
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
    toggleForm() {
      this.showForm = !this.showForm;
      this.clearTipForm();
    },
    openTipDeeplink() {
      window.location = createDeepLinkUrl({ type: 'tips' });
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-post {
  background-color: $actions_ribbon_background_color;

  form {
    padding: 12px 20px 0 20px;
  }

  .form-row {
    margin-top: 20px;

    .form-group {
      border: 1px solid $buttons_background;
      border-radius: 6px;
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
    position: relative;
    background-color: $buttons_background;
    color: $standard_font_color;
    border-top: 1px solid $buttons_background;
    border-bottom: 1px solid $buttons_background;
    border-radius: 6px;
    padding: 0;

    input,
    input:focus {
      border: 0;
    }

    &:focus-within {
      border-color: $secondary_color;
      background-color: $background_color;
    }

    input {
      background-color: $buttons_background;
      color: $standard_font_color;
      font-size: 14px;
      padding: 8.5px 16px;
    }

    input:focus {
      background-color: $background_color;
    }
  }

  .form-group {
    margin-bottom: 0;

    input {
      &.comment {
        display: inline-block;
        width: calc(100% - 60px);
      }

      background-color: $buttons_background;
      color: $standard_font_color;
      font-size: 14px;
      height: 40px;
    }
  }

  .send-url,
  .send-amount {
    margin-bottom: 1rem;
  }

  .tip-post-balance span {
    font-size: 0.75rem;
    color: $standard_font_color;
  }

  .tip-post-label {
    font-weight: 600;
    font-size: 16px;
    color: $standard_font_color;
    padding: 7.5px 10px;
    background-color: $light_color;

    label {
      margin-bottom: 0;
    }
  }

  .url-status {
    width: 18px;
    height: 18px;
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
  }

  input.url-input {
    padding-left: 42px;

    &:focus {
      box-shadow: none;
    }
  }

  .closed-view.message-input {
    padding: 20px;

    textarea::placeholder {
      color: $standard_font_color;
    }
  }

  .close-sendform {
    width: 17px;
    height: 17px;
    float: right;

    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }

  .ae-button {
    width: 100%;
    height: 40px;
    margin-top: 1px;
    margin-bottom: 1px;

    svg {
      height: 22px;
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
