<template>
  <div class="send-tip tip__post">
    <div v-if="showForm">
      <div class="tip__post__label clearfix">
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
import { createDeepLinkUrl, shiftDecimalPlaces } from '../../../utils';
import { tip } from '../../../utils/aeternity';
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
      inputToken: 'native',
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
    ...mapState(['useSdkWallet', 'tokenInfo']),
    isTipAmountValid() {
      return this.inputToken !== 'native' || (this.sendTipForm.amount > this.minTipAmount);
    },
    isSendTipDataValid() {
      const urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/g;
      // TODO: better validation
      return this.isTipAmountValid
          && this.sendTipForm.url.length > 0
          && this.sendTipForm.title.length > 0
          && urlRegex.test(this.sendTipForm.url)
          && !this.isBlacklistedUrl;
    },
  },
  methods: {
    async sendTip() {
      this.sendingTip = true;
      const amount = shiftDecimalPlaces(this.sendTipForm.amount,
        this.inputToken !== 'native' ? this.tokenInfo[this.inputToken].decimals : 18).toFixed();

      tip(this.sendTipForm.url, this.sendTipForm.title, amount, this.inputToken)
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
      window.location = createDeepLinkUrl({ type: 'tip' });
    },
  },
};
</script>

<style lang="scss" scoped>
.tip__post {
  background-color: $actions_ribbon_background_color;

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
    position: relative;
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
    width: 0.85rem;
    height: 0.85rem;
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
