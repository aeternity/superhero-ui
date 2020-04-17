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
        <Avatar
          :address="account"
          class="avatar mr-3"
        />
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
        <div class="col-md-4">
          <ae-input-amount v-model="sendTipForm.amount" />
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
import AeInputAmount from '../AeInputAmount.vue';
import util from '../../utils/util';
import aeternity from '../../utils/aeternity';
import { EventBus } from '../../utils/eventBus';
import Backend from '../../utils/backend';
import AeButton from '../AeButton.vue';
import IconDiamond from '../../assets/iconDiamond.svg';
import Avatar from '../Avatar.vue';

export default {
  name: 'SendTip',
  components: {
    AeInputAmount,
    AeButton,
    Avatar,
  },
  data() {
    return {
      sendTipForm: {
        amount: 0,
        url: '',
        title: '',
      },
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

<style lang="scss">
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
      padding: 0.6rem 1rem 1rem 1rem;

      .form-row {
        margin: 1rem 0 1rem 0;

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

      .tip__post__balance {
        span {
          font-size: 0.75rem;
          color: $standard_font_color;
        }
      }

      .avatar,
      .user-identicon svg {
        width: 2rem;
        height: 2rem;
        border-radius: 1rem;
      }
    }

    .ae-button {
      padding: 0.55rem 2.87rem 0.65rem 2.87rem;
      font-weight: 600;
    }

    .avatar {
      vertical-align: middle;
    }

    .tip__post__label {
      font-weight: 600;
      font-size: 0.8rem;
      color: $standard_font_color;
      padding: 0.75rem 1rem;
      background-color: $light_color;

      label {
        margin-bottom: 0;
      }
    }
  }

</style>
