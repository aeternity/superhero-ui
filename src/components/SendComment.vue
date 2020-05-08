<template>
  <div>
    <form
      class="reply__form"
      @submit.prevent
    >
      <Avatar
        :address="address"
        class="avatar"
      />
      <div class="input-group">
        <input
          v-model="newComment"
          type="text"
          placeholder="Add reply"
          class="form-control reply__input"
        >
      </div>
      <div class="send-comment">
        <AeButton
          v-if="newComment.length > 0"
          @click="sendTipComment"
        >
          {{ $t('views.TipCommentsView.Reply') }}
          <img
            src="../assets/backArrow.svg"
            class="arrow"
          >
        </AeButton>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '../utils/eventBus';
import { USE_DEEP_LINKS, createDeepLinkUrl } from '../utils/util';
import { wallet } from '../utils/walletSearch';
import AeButton from './AeButton.vue';
import Avatar from './Avatar.vue';
import Backend from '../utils/backend';

export default {
  name: 'SendComment',
  components: {
    AeButton,
    Avatar,
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
  created() {
    const loadUserAvatar = setInterval(() => {
      if (this.isLoggedIn) {
        this.address = this.account;
        clearInterval(loadUserAvatar);
      }
    }, 500);
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
        wallet.client.rpcClient.getCurrentAccount(),
        (data) => wallet.signMessage(data),
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
  }

  .reply__input {
    width: 100%;
    padding-right: 4rem;
  }

  .send-comment .ae-button {
    padding: 0;
    height: 2.1rem;
    min-width: 3rem;
    background-color: transparent;
    position: absolute;
    z-index: 10;
    right: 0.5rem;

    img {
      width: 0.8rem;
      color: white;
      transform: rotate(180deg);
    }
  }
</style>
