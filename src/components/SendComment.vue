<template>
  <form class="send-comment" @submit.prevent="sendTipComment">
    <MessageInput
      v-model="comment"
      :placeholder="$t('views.TipCommentsView.AddReply')"
      :show-submit-button="allowSubmit"
      :submit-button-title="$t('views.TipCommentsView.Reply')"
      @keydown.enter.exact.prevent="sendTipComment"
    />
  </form>
</template>

<script>
import { EventBus } from '../utils/eventBus';
import { createDeepLinkUrl } from '../utils/util';
import { client } from '../utils/aeternity';
import MessageInput from './MessageInput.vue';
import Backend from '../utils/backend';

export default {
  name: 'SendComment',
  components: { MessageInput },
  props: {
    tipId: { type: [Number, String], required: true },
    parentId: { type: [Number, String], default: undefined },
  },
  data: () => ({
    comment: '',
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
      await Backend.sendTipComment(
        this.tipId,
        this.comment,
        client.rpcClient.getCurrentAccount(),
        (data) => client.signMessage(data),
        this.parentId,
      );
      EventBus.$emit('reloadData');
      this.comment = '';
    },
  },
};
</script>
