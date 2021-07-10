<template>
  <div class="tip-record">
    <RouterLink
      v-if="!detailed"
      :to="{ name: 'tip', params: { tipId: tip.id } }"
    />
    <AuthorAndDate
      :date="tip.timestamp"
      :address="tip.sender"
    >
      <ButtonThreeDots
        v-if="isLoggedIn"
        ref="menuOpener"
        @click="$store.dispatch('modals/open', {
          name: 'feed-item-menu',
          ...tip,
          reference: $refs.menuOpener.$el,
        })"
      />
    </AuthorAndDate>
    <TipTitle :tip-title="tip.title" />
    <TipMedia
      v-if="tip.media && tip.media.length"
      :media="tip.media"
    />
    <TipPreview
      v-if="tipUrl || tip.receiver"
      :tip="tip"
      :tip-url="tipUrl"
    />
    <div class="actions">
      <TipInput
        v-if="tip.type === 'POST_WITHOUT_TIP'"
        :tip="{ ...tip, url: `https://superhero.com/tip/${tip.id}` }"
      />
      <span v-else />
      <ButtonFeed disabled>
        <IconComment slot="icon" />
        {{ tip.commentCount }}
      </ButtonFeed>
      <ButtonFeed v-if="UNFINISHED_FEATURES">
        <IconShare slot="icon" />
      </ButtonFeed>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TipTitle from './TipTitle.vue';
import TipMedia from './TipMedia.vue';
import TipPreview from './TipPreview.vue';
import TipInput from '../TipInput.vue';
import AuthorAndDate from './AuthorAndDate.vue';
import ButtonThreeDots from '../ButtonThreeDots.vue';
import ButtonFeed from '../ButtonFeed.vue';
import IconComment from '../../assets/iconComment.svg?icon-component';
import IconShare from '../../assets/iconShare.svg?icon-component';

export default {
  components: {
    TipTitle,
    TipMedia,
    TipPreview,
    AuthorAndDate,
    ButtonThreeDots,
    ButtonFeed,
    IconComment,
    IconShare,
    TipInput,
  },
  props: {
    tip: { type: Object, required: true },
    detailed: Boolean,
  },
  data: () => ({
    UNFINISHED_FEATURES: process.env.UNFINISHED_FEATURES,
  }),
  computed: {
    ...mapGetters(['isLoggedIn']),
    tipUrl() {
      if (!this.tip?.url) return null;
      return this.tip.url.startsWith('http://') || this.tip.url.startsWith('https://') ? this.tip.url : `http://${this.tip.url}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-record {
  background-color: $light_color;
  padding: 1rem 1rem 0.75rem 1rem;
  margin-bottom: 0.15rem;
  position: relative;

  @include smallest {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  > a::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .author-and-date ::v-deep .author,
  .author-and-date .button-three-dots,
  .tip-title ::v-deep .topic,
  .tip-media,
  .tip-preview,
  .tip-input {
    position: relative;
  }

  .actions {
    margin-top: 0.75rem;
    display: flex;
    justify-content: space-between;

    &::after {
      content: '';
    }
  }
}
</style>
