<template>
  <div class="tip__post" v-bind:class="{ active: isLoggedIn }">
    <form @submit.prevent>
      <div class="form-row">
        <label class="tip__post__label pl-2">Send Tip</label>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4">
          <div class="input-group mb-3">
            <input type="number" step="0.1" v-model="sendTipForm.amount" placeholder="Amount" class="form-control" aria-label="Default"
                   aria-describedby="inputGroup-sizing-mn">
            <div class="input-group-append">
              <span class="input-group-text append__ae">AE</span>
            </div>
          </div>
        </div>
        <div class="form-group col-md-8">
          <input type="text" v-model="sendTipForm.url" class="form-control" placeholder="Enter URL">
        </div>
      </div>
      <div class="form-group">
        <input type="text" class="form-control" v-model="sendTipForm.title" placeholder="Add message">
      </div>
      <div class="form-row">
        <div class="col-sm-4 tip__post__balance pl-2">
                 <span>{{ balance }} AE
                   <fiat-value v-if="balance" :amount="balance"></fiat-value>
                 </span>
        </div>
        <div class="col-sm-4 offset-4 text-right mt-2">
          <button @click="sendTip()" class="btn btn-primary tip__send">Tip</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import FiatValue from "../FiatValue";
  import { mapGetters } from "vuex";
  import util from "../../utils/util";
  import aeternity from "../../utils/aeternity";
  import { EventBus } from "../../utils/eventBus";

  export default {
    name: 'SendTip',
    components: {
      FiatValue
    },
    computed: {
      ...mapGetters(['balance', 'isLoggedIn'])
    },
    data() {
      return {
        sendTipForm: {
          amount: null,
          url: '',
          title: ''
        }
      }
    },
    methods: {
      async sendTip() {
        const amount = util.aeToAtoms(this.sendTipForm.amount);
        await aeternity.contract.methods.tip(this.sendTipForm.url, this.sendTipForm.title, {amount: amount}).catch(console.error);
        this.clearTipForm();
        EventBus.$emit('reloadData');
      },
      clearTipForm() {
        this.sendTipForm = {amount: null, url: '', title: ''}
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/base";

  .tip__post {
    background-color: $actions_ribbon_background_color;
    max-height: 0;
    transition: max-height 0.25s ease-in;
    opacity: 0;

    &.active {
      max-height: 400px;
      opacity: 100%;
    }

    form {
      padding: 1rem;

      span.append__ae {
        font-size: 0.75rem;
        background: $background_color;
        color: $secondary_color;
        cursor: default;

        &:hover {
          background: $background_color;
          cursor: default;
        }
      }

      .tip__post__label {
        font-weight: 600;
        color: white;
      }

      .form-group {
        margin-bottom: 0;

        input {
          background-color: $background_color;
          color: #FFF;
          font-size: .75rem;
          border: 1px solid #21212A;
        }
      }

      .tip__post__balance {
        span {
          font-size: 0.75rem;
          color: white;
        }
      }

      .tip__send {
        padding-left: 3rem;
        padding-right: 3rem;
        color: white;
        background-color: $custom_links_color
      }
    }
  }

</style>
