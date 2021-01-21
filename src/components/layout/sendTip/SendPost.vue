<template>
  <form
    class="send-post"
    @submit.prevent
  >
    <MessageInput
      v-model="title"
      maxlength="280"
      :placeholder="$t('What are your thoughts?')"
    />
    <MediaRow
      v-if="media.length"
      :media="media.map(({ link }) => link)"
      delete-btn
      @get-index="deleteImage($event)"
    />
    <GiphySearch
      v-if="showGifs"
      @add-gif="media.push({ link: $event })"
    />
    <div class="mt-2 d-flex flex-row justify-content-between">
      <div class="post-actions">
        <label>
          <IconPictures />
          <input
            type="file"
            name="upload-image"
            accept="image/png, image/jpeg, image/gif"
            @change="uploadImage($event)"
          >
        </label>
        <ButtonPlain @click="showGifs = !showGifs">
          <IconGif :class="{ active: showGifs }" />
        </ButtonPlain>
        <ButtonPlain disabled>
          <IconEmoji />
        </ButtonPlain>
        <ButtonPlain disabled>
          <IconPoll />
        </ButtonPlain>
        <ButtonPlain disabled>
          <IconThreeDots />
        </ButtonPlain>
      </div>
      <ButtonPlain
        class="btn btn-primary post-submit text-nowrap"
        type="submit"
        :disabled="!title.length || sendingPost || uploadingMedia"
        @click="sendPost"
      >
        <IconPosts /> {{ $t('Post') }}
      </ButtonPlain>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { EventBus } from '../../../utils/eventBus';
import MessageInput from '../../MessageInput.vue';
import ButtonPlain from '../../ButtonPlain.vue';
import IconPictures from '../../../assets/iconPictures.svg?icon-component';
import IconGif from '../../../assets/iconGif.svg?icon-component';
import IconEmoji from '../../../assets/iconEmoji.svg?icon-component';
import IconPoll from '../../../assets/iconPoll.svg?icon-component';
import IconThreeDots from '../../../assets/iconThreeDots.svg?icon-component';
import IconPosts from '../../../assets/iconPosts.svg?icon-component';
import GiphySearch from './GiphySearch.vue';
import MediaRow from '../../MediaRow.vue';

export default {
  components: {
    MessageInput,
    ButtonPlain,
    IconPictures,
    IconGif,
    IconEmoji,
    IconPoll,
    IconThreeDots,
    IconPosts,
    GiphySearch,
    MediaRow,
  },
  data() {
    return {
      title: '',
      media: [],
      sendingPost: false,
      uploadingMedia: false,
      showGifs: false,
    };
  },
  computed: mapState(['address', 'balance']),
  methods: {
    async sendPost() {
      this.sendingPost = true;
      const data = {
        title: this.title,
        media: this.media.map((i) => i.link),
      };

      try {
        if (+this.balance === 0) {
          await this.postWithZeroBalance(data.title, data.media);
        } else {
          await this.$store.dispatch('aeternity/postWithoutTip', { title: data.title, media: data.media });
        }
        this.clearPostForm();
        this.$store.dispatch('modals/open', {
          name: 'success',
          title: this.$t('components.layout.SendTip.SuccessHeader'),
          body: 'Post sent!',
        });
        setTimeout(() => EventBus.$emit('reloadData'), 5000);
      } catch (error) {
        console.error(error);
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: this.$t('components.layout.SendTip.ErrorHeader'),
          body: 'Post not sent, please try again',
        });
      } finally {
        this.sendingPost = false;
      }
    },
    async postWithZeroBalance(title, media) {
      const signature = await this.$store.dispatch('postWithoutTipSignature', { title, media });
      return this.$store.dispatch('backend/sendPostWithoutTip', {
        author: this.address,
        title,
        media,
        signature,
      });
    },
    async uploadImage(event) {
      this.uploadingMedia = true;

      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      try {
        const result = await fetch('https://api.imgur.com/3/image.json', {
          method: 'post',
          body: formData,
          headers: {
            Authorization: `Client-ID ${process.env.VUE_APP_IMGUR_API_CLIENT_ID}`,
          },
        });
        const { data } = await result.json();
        this.media.push({ link: data.link, deletehash: data.deletehash });
      } finally { this.uploadingMedia = false; }
    },
    async deleteImage(index) {
      if (this.media[index].deletehash) {
        await fetch(`https://api.imgur.com/3/image/${this.media[index].deletehash}`, {
          method: 'delete',
          headers: {
            Authorization: `Client-ID ${process.env.VUE_APP_IMGUR_API_CLIENT_ID}`,
          },
        });
      }

      this.media.splice(index, 1);
    },
    clearPostForm() {
      this.title = '';
      this.media = [];
      this.sendingPost = false;
      this.uploadingMedia = false;
      this.showGifs = false;
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="file"] {
  display: none;
}

.send-post {
  .post-actions {
    padding-bottom: 0.6rem;

    svg {
      height: 2rem;
      width: auto;

      &:hover {
        background-color: $light_color;
        border-radius: 100%;
      }

      &.active {
        color: $text_content_color;
      }
    }

    label {
      cursor: pointer;
    }
  }

  .post-submit {
    max-width: 4.5rem;
    color: $standard_font_color;
    background-color: $secondary_color;
    border: none;
    width: 100%;
    height: 2.2rem;
    margin-top: 0.05rem;
    margin-bottom: 1rem;

    svg {
      height: 1.1em;
    }

    .loading {
      transform: scale(0.6);
      margin-top: -0.7rem;
    }

    &[disabled] {
      opacity: 0.4;
    }

    span {
      vertical-align: inherit;
    }
  }
}
</style>
