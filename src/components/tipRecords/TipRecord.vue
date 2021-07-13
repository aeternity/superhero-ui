<template>
  <div
    class="tip-record"
    @click="goToTip"
  >
    <AuthorAndDate
      :date="tip.timestamp"
      :address="tip.sender"
    >
      <ThreeDotsMenu v-if="address">
        <ButtonPlain @click="sendReport">
          {{ $t('components.tipRecords.TipRecord.reportPost') }}
        </ButtonPlain>
        <ButtonPlain
          v-if="tip.type === 'AE_TIP'"
          @click="claim"
        >
          {{ $t('components.tipRecords.TipRecord.claim') }}
        </ButtonPlain>
        <ButtonPlain @click="pinOrUnPinTip">
          {{
            isTipPinned ?
              $t('components.tipRecords.TipRecord.UnPin')
              : $t('components.tipRecords.TipRecord.Pin')
          }}
        </ButtonPlain>
      </ThreeDotsMenu>
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
    <div
      class="actions"
      @click.stop
    >
      <TipInput
        v-if="tip.type === 'POST_WITHOUT_TIP'"
        :tip="{ ...tip, url: `https://superhero.com/tip/${tip.id}` }"
      />
      <span v-else />
      <ButtonFeed
        :disabled="detailed"
        @click.stop="$router.push(toTip)"
      >
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
import { mapState } from 'vuex';
import Backend from '../../utils/backend';
import backendAuthMixin from '../../utils/backendAuthMixin';
import TipTitle from './TipTitle.vue';
import TipMedia from './TipMedia.vue';
import TipPreview from './TipPreview.vue';
import TipInput from '../TipInput.vue';
import ThreeDotsMenu from '../ThreeDotsMenu.vue';
import AuthorAndDate from './AuthorAndDate.vue';
import ButtonPlain from '../ButtonPlain.vue';
import ButtonFeed from '../ButtonFeed.vue';
import IconComment from '../../assets/iconComment.svg?icon-component';
import IconShare from '../../assets/iconShare.svg?icon-component';

export default {
  components: {
    TipTitle,
    TipMedia,
    TipPreview,
    ThreeDotsMenu,
    AuthorAndDate,
    ButtonPlain,
    ButtonFeed,
    IconComment,
    IconShare,
    TipInput,
  },
  mixins: [backendAuthMixin(true)],
  props: {
    tip: { type: Object, required: true },
    detailed: Boolean,
  },
  data: () => ({
    UNFINISHED_FEATURES: process.env.UNFINISHED_FEATURES,
  }),
  computed: {
    ...mapState(['address']),
    ...mapState('aeternity', ['useSdkWallet']),
    ...mapState({
      isTipPinned({ pinnedItems }) {
        return pinnedItems.some(({ id }) => id === this.tip.id);
      },
    }),
    toTip() {
      return { name: 'tip', params: { tipId: this.tip.id } };
    },
    tipUrl() {
      if (!this.tip?.url) return null;
      return this.tip.url.startsWith('http://') || this.tip.url.startsWith('https://') ? this.tip.url : `http://${this.tip.url}`;
    },
  },
  methods: {
    async sendReport() {
      await this.backendAuth('sendPostReport', { tipId: this.tip.id }, this.toTip);
      if (this.useSdkWallet) {
        await this.$store.dispatch('modals/open', {
          name: 'success',
          title: this.$t('components.tipRecords.TipRecord.reportPostTitle'),
          body: this.$t('components.tipRecords.TipRecord.reportPostBody'),
        });
      }
    },
    async claim() {
      try {
        await Backend.claimFromUrl({
          url: this.tip.url,
          address: this.address,
        });
        this.$store.dispatch('modals/open', {
          name: 'success',
          title: this.$t('components.tipRecords.TipRecord.claimTitle'),
          body: this.$t('components.tipRecords.TipRecord.claimBodySuccess'),
        });
      } catch (e) {
        this.$store.dispatch('modals/open', {
          name: 'failure',
          title: this.$t('components.tipRecords.TipRecord.claimTitle'),
          body: this.$t('components.tipRecords.TipRecord.claimBodyFailure'),
        });
      }
    },
    async pinOrUnPinTip() {
      await this.backendAuth(
        this.isTipPinned ? 'unPinItem' : 'pinItem',
        { entryId: this.tip.id, type: 'TIP' },
        this.toTip,
      );
      await this.$store.dispatch('updatePinnedItems');
    },
    goToTip() {
      if (this.detailed) {
        return this.tipUrl ? window.open(this.tipUrl) : null;
      }
      return this.$router.push(this.toTip);
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-record {
  background-color: $light_color;
  padding: 1rem 1rem 0.75rem 1rem;
  margin-bottom: 0.15rem;
  cursor: pointer;

  @include smallest {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
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
