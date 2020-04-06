<template>
  <div
    v-if="canTip"
    class="tip__post"
    :class="{ active: !loading.wallet }"
  >
    <div class="tip__post__label">
      <label>Send New Tip</label>
    </div>
    <form @submit.prevent>
      <div class="form-group">
        <img
          :src="avatar"
          class="avatar mr-3"
        >
        <input
          v-model="sendTipForm.title"
          type="text"
          class="form-control comment"
          placeholder="Add message"
        >
      </div>
      <div class="form-row">
        <div class="form-group col-md-8">
          <input
            v-model.trim="sendTipForm.url"
            type="text"
            class="form-control"
            placeholder="Enter URL"
          >
        </div>
        <div class="form-group col-md-4">
          <div class="input-group">
            <input
              v-model.number="sendTipForm.amount"
              type="number"
              min="0"
              step="0.1"
              placeholder="Amount"
              class="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-mn"
            >
            <div class="input-group-append">
              <span class="input-group-text append__ae">
                <span class="ae">AE&nbsp;</span>
                <fiat-value
                  :display-symbol="true"
                  :amount="sendTipForm.amount.toString()"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <ae-button
          :disabled="!isSendTipDataValid"
          :src="IconDiamond"
          @click="sendTip()"
        >
          Tip
        </ae-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FiatValue from '../FiatValue.vue';
import util from '../../utils/util';
import aeternity from '../../utils/aeternity';
import { EventBus } from '../../utils/eventBus';
import avatar from '../../assets/userAvatar.svg';
import Backend from '../../utils/backend';
import AeButton from '../AeButton.vue';
import IconDiamond from '../../assets/iconDiamond.svg';

export default {
  name: 'SendTip',
  components: {
    FiatValue,
    AeButton,
  },
  data() {
    return {
      sendTipForm: {
        amount: 0,
        url: '',
        title: '',
      },
      avatar,
      canTip: false,
      IconDiamond,
    };
  },
  computed: {
    ...mapGetters(['balance', 'loading', 'account', 'isLoggedIn']),
    isSendTipDataValid() {
      const urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/g;
      // TODO: better validation
      return this.sendTipForm.amount > 0
          && this.sendTipForm.url.length > 0
          && this.sendTipForm.title.length > 0
          && urlRegex.test(this.sendTipForm.url);
    },
  },
  async created() {
    const loadUserAvatar = setInterval(() => {
      if (this.isLoggedIn) {
        this.canTip = true;
        const userImage = Backend.getProfileImageUrl(this.account);
        if (userImage) {
          this.avatar = userImage;
        }
        clearInterval(loadUserAvatar);
      }
    }, 1000);
  },
  methods: {
    async sendTip() {
      const amount = util.aeToAtoms(this.sendTipForm.amount);
      await aeternity.tip(this.sendTipForm.url, this.sendTipForm.title, amount)
        .catch(console.error);
      await Backend.cacheInvalidateTips().catch(console.error);
      this.clearTipForm();
      EventBus.$emit('reloadData');
    },
    clearTipForm() {
      this.sendTipForm = { amount: 0, url: '', title: '' };
    },
  },
};
</script>

<style lang="scss" scoped>
  .tip__post {
    background-color: $actions_ribbon_background_color;
    max-height: 0;
    transition: max-height 0.25s ease-in;
    opacity: 0;

    &.active {
      max-height: 400px;
      opacity: 1;
    }

    form {
      padding: .6rem 1rem 1rem 1rem;

      span.append__ae {
        font-size: 0.75rem;
        background: $buttons_background;
        cursor: default;
        & .ae{
          color: $secondary_color;
        }
        &:hover {
          background: $buttons_background;
          cursor: default;
        }
      }

      .form-group {
        margin-bottom: 0;
        .input-group{
          border-radius: .25rem;
        }
        input {
          &[type=number]:focus{
            border-right: none;
          }
          &[type=number]:focus~.input-group-append .input-group-text{
            border: .05rem solid $custom_links_color;
            border-left: none;
          }
          &.comment{
            display: inline-block;
            width: calc(100% - 3.01rem);
          }
          background-color: $buttons_background;
          color: $standard_font_color;
          font-size: .75rem;
          border: .05rem solid transparent;
          height: 2.2rem;
          margin-bottom: 1rem;
          &:focus{
             border: .05rem solid $custom_links_color;
          }
        }
      }

      .tip__post__balance {
        span {
          font-size: 0.75rem;
          color:$standard_font_color;
        }
      }

      .avatar{
        width: 2rem;
        height: 2rem;
        border-radius: 1rem;
      }
    }
    .ae-button {
      padding: .55rem 2.87rem .65rem 2.87rem;
      font-weight: 600;
    }

    .avatar {
      vertical-align: middle;
    }


    .tip__post__label {
      font-weight: 600;
      font-size: .8rem;
      color: $standard_font_color;
      padding: .75rem 1rem;
      background-color: $light_color;

      label {
        margin-bottom: 0;
      }
    }
  }

</style>
