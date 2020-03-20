<template>
  <div class="tip__post" v-bind:class="{ active: !loading.wallet }">
    <form @submit.prevent>
      <div class="form-row">
        <label class="tip__post__label pl-2">Send Tip</label>
      </div>
      <div class="form-row">
        <div class="form-group col-md-5">
          <div class="input-group mb-2">
            <input
              type="number"
              min="0"
              step="0.1"
              v-model.number="sendTipForm.amount"
              placeholder="Amount"
              class="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-mn"
            >
            <div class="input-group-append">
              <span class="input-group-text append__ae">
                <span class="ae">AE&nbsp;</span>
                <fiat-value :displaySymbol="true" :amount="sendTipForm.amount"/>
              </span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-7">
          <input
            type="text"
            v-model.trim="sendTipForm.url"
            class="form-control mb-2"
            placeholder="Enter URL"
          >
        </div>
      </div>
      <div class="form-group mb-3">
        <img :src="avatar" class="avatar mr-3">
        <input
          type="text"
          class="form-control comment"
          v-model="sendTipForm.title"
          placeholder="Add message"
        >
      </div>
      <div class="text-right">
        <button
          @click="sendTip()"
          :disabled='!isSendTipDataValid'
          class="btn btn-primary tip__send"
        >
          Tip
        </button>

        <!-- <div class="col-sm-4 tip__post__balance pl-2">
                 <span>{{ balance }} AE
                   <fiat-value v-if="balance" :amount="balance"></fiat-value>
                 </span>
        </div> -->
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

export default {
  name: 'SendTip',
  components: {
    FiatValue,
  },
  computed: {
    ...mapGetters(['balance', 'loading']),
    isSendTipDataValid() {
      const urlRegex = /(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/g;
      // TODO: better validation
      return this.sendTipForm.amount > 0
          && this.sendTipForm.url.length > 0
          && urlRegex.test(this.sendTipForm.url);
    },
  },
  data() {
    return {
      sendTipForm: {
        amount: null,
        url: '',
        title: '',
      },
      avatar,
    };
  },
  methods: {
    async sendTip() {
      const amount = util.aeToAtoms(this.sendTipForm.amount);
      await aeternity.contract.methods
        .tip(this.sendTipForm.url, this.sendTipForm.title, { amount }).catch(console.error);
      this.clearTipForm();
      EventBus.$emit('reloadData');
    },
    clearTipForm() {
      this.sendTipForm = { amount: null, url: '', title: '' };
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
        background: $background_color;
        cursor: default;
        & .ae{
          color: $secondary_color;
        }
        &:hover {
          background: $background_color;
          cursor: default;
        }
      }

      .tip__post__label {
        font-weight: 600;
        color: $standard_font_color;
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
            width: calc(100% - 3.25rem);
          }
          background-color: $background_color;
          color: $standard_font_color;
          font-size: .75rem;
          border: .05rem solid transparent;
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

      .tip__send {
        padding: .6rem 2.45rem .7rem 2.45rem;
        color:$standard_font_color;
        background-color: $custom_links_color;
        border: none;
        font-size: .75rem;
        font-weight: 600;
      }
    }
  }

</style>
