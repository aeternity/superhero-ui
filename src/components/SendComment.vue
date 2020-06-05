<template>
  <div>
    <form
      class="reply__form"
      @submit.prevent
    >
      <AvatarWrapper
        :address="account"
        class="avatar"
      />
      <div class="input-group">
        <textarea
          ref="input"
          v-model="newComment"
          :placeholder="$t('views.TipCommentsView.AddReply')"
          class="form-control reply__input"
          rows="1"
          @keydown.enter.exact.prevent="sendTipComment"
        />
        <div class="message-carret" />
      </div>
      <div class="send-comment">
        <AeButton
          v-if="newComment.trim().length > 0"
          @click="sendTipComment"
        >
          <img
            src="../assets/backArrow.svg"
            class="arrow"
            :title="$t('views.TipCommentsView.Reply')"
          >
        </AeButton>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import autosize from 'autosize';
import { EventBus } from '../utils/eventBus';
import { USE_DEEP_LINKS, createDeepLinkUrl } from '../utils/util';
import { client } from '../utils/aeternity';
import AeButton from './AeButton.vue';
import AvatarWrapper from './AvatarWrapper.vue';
import Backend from '../utils/backend';

export default {
  name: 'SendComment',
  components: {
    AeButton,
    AvatarWrapper,
  },
  props: {
    tipId: { type: [Number, String], required: true },
    parentId: { type: [Number, String], default: undefined },
  },
  data() {
    return {
      newComment: '',
      address: null,
      USE_DEEP_LINKS,
    };
  },
  computed: mapGetters(['account', 'isLoggedIn']),
  mounted() {
    autosize(this.$refs.input);
  },
  methods: {
    async sendTipComment() {
      if (this.USE_DEEP_LINKS || !this.isLoggedIn) {
        window.location = createDeepLinkUrl(
          {
            type: 'comment', id: this.tipId, text: this.newComment, parentId: this.parentId,
          },
        );
        return;
      }
      await Backend.sendTipComment(
        this.tipId,
        this.newComment,
        client.rpcClient.getCurrentAccount(),
        (data) => client.signMessage(data),
        this.parentId,
      );
      EventBus.$emit('reloadData');
      this.newComment = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  margin-right: 1rem;
}

.reply__form {
  display: flex;
  position: relative;

  .input-group {
    position: relative;
  }
}

.input-group > textarea.reply__input.form-control {
  width: 100%;
  padding-right: 1.3rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  line-height: 1.25rem;
}

.send-comment .ae-button {
  padding: 0;
  height: 2.1rem;
  background-color: transparent;
  z-index: 10;
  min-width: 1rem;
  right: 0.2rem;

  @include vertical-align(absolute);

  img {
    width: 0.8rem;
    color: white;
    transform: rotate(180deg);
    vertical-align: baseline;
  }
}

.message-carret {
  left: -0.4rem;
  top: 0.7rem;
}

</style>
