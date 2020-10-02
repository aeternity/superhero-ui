<template>
  <form
    class="send-comment"
    @submit.prevent="sendTipComment"
  >
    <MessageInput
      v-model="comment"
      :placeholder="$t('views.TipCommentsView.AddReply')"
      :show-submit-button="allowSubmit"
      :submit-button-title="$t('views.TipCommentsView.Reply')"
      :set-loading="setLoading"
      @keydown.enter.exact.prevent="sendTipComment"
    />
  </form>
</template>

<script>
import { EventBus } from '../utils/eventBus';
import { createDeepLinkUrl, handleUnknownError } from '../utils/util';
import { client } from '../utils/aeternity';
import MessageInput from './MessageInput.vue';
import backendAuthMixin from '../utils/backendAuthMixin';

export default {
  components: { MessageInput },
  mixins: [backendAuthMixin(true)],
  props: {
    tipId: { type: [Number, String], required: true },
    parentId: { type: [Number, String], default: undefined },
  },
  data: () => ({
    comment: '',
    setLoading: false,
  }),
  computed: {
    allowSubmit() {
      return this.comment.trim().length > 0;
    },
  },
  methods: {
    async sendTipComment() {
      if (!this.allowSubmit) return;
      if (!this.$store.state.useSdkWallet) {
        window.location = createDeepLinkUrl({
          type: 'comment', id: this.tipId, text: this.comment, parentId: this.parentId,
        });
        return;
      }
      this.setLoading = true;
      try {
        await this.backendAuth('sendTipComment', {
          tipId: this.tipId,
          text: this.comment,
          author: client.rpcClient.getCurrentAccount(),
          parentId: this.parentId,
        });
        EventBus.$emit('reloadData');
      } catch (e) {
        if (e.message !== 'Operation rejected by user') handleUnknownError(e);
      } finally {
        this.comment = '';
        this.setLoading = false;
      }
    },
  },
};
</script>
