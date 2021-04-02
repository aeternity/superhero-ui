<template>
  <div
    class="tip-record row"
    @click="goToTip"
  >
    <div class="tip-body">
      <div class="tip-description">
        <AuthorAndDate
          :date="tip.timestamp"
          :address="tip.sender"
        >
          <ThreeDotsMenu v-if="address">
            <div @click="sendReport">
              {{ $t('components.tipRecords.TipRecord.reportPost') }}
            </div>
            <div @click="claim">
              {{ $t('components.tipRecords.TipRecord.claim') }}
            </div>
            <div @click="pinOrUnPinTip">
              {{
                isTipPinned ?
                  $t('components.tipRecords.TipRecord.UnPin')
                  : $t('components.tipRecords.TipRecord.Pin')
              }}
            </div>
          </ThreeDotsMenu>
        </AuthorAndDate>
      </div>
      <div class="tip-note pr-2">
        <TipTitle :tip-title="tip.title" />
        <TipMedia
          v-if="tip.media && tip.media.length"
          :media="tip.media"
        />
      </div>
      <TipPreview
        v-if="tipUrl"
        :tip="tip"
        :go-to-tip="goToTip"
        :tip-url="tipUrl"
      />
      <div
        class="tip-footer"
        @click.stop
      >
        <TipInput
          v-if="tip.type === 'POST_WITHOUT_TIP'"
          :tip="{ ...tip, url: `https://superhero.com/tip/${tip.id}` }"
        />
        <div class="actions-wrapper">
          <ButtonPlain
            class="action"
            :class="{ active: isTipPinned }"
            @click="pinOrUnPinTip"
          >
            <IconStarFilled v-if="isTipPinned" />
            <IconStar v-else />
          </ButtonPlain>
          <ButtonPlain
            class="action"
            :class="{ active: tip.commentCount, disabled: $route.name === 'tip' }"
            @click.stop="$route.name === 'tip' ? null : $router.push(toTip)"
          >
            <IconComments />
            <span>{{ tip.commentCount }}</span>
          </ButtonPlain>
          <ButtonPlain class="action">
            <IconShare />
          </ButtonPlain>
        </div>
      </div>
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
import IconComments from '../../assets/iconComments.svg?icon-component';
import IconStar from '../../assets/iconStar.svg?icon-component';
import IconStarFilled from '../../assets/iconStarFilled.svg?icon-component';
import IconShare from '../../assets/iconShare.svg?icon-component';

export default {
  components: {
    TipTitle,
    TipMedia,
    TipPreview,
    ThreeDotsMenu,
    AuthorAndDate,
    ButtonPlain,
    IconComments,
    IconStar,
    IconStarFilled,
    IconShare,
    TipInput,
  },
  mixins: [backendAuthMixin(true)],
  props: {
    tip: { type: Object, required: true },
  },
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
      if (this.$route.params.tipId === this.tip.id) {
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
  margin: 0 0 0.15rem 0;

  &:hover {
    cursor: pointer;
  }
}

.tip-body {
  padding-top: 1rem;
  width: 100%;

  .tip-description .author-and-date {
    padding-left: 1rem;
    padding-right: 1rem;

    .date .three-dots {
      font-size: 0.75rem;
      margin-left: 0.3rem;
    }
  }
}

.tip-note {
  @include truncate-overflow-mx(4);

  color: $tip_note_color;
  font-size: 0.85rem;
  line-height: 1.1rem;
  margin-bottom: 0.8rem;
  padding-left: 1rem;

  ::v-deep .title .topic {
    color: $standard_font_color;

    &:hover {
      text-decoration: underline;
    }
  }
}

.tip-footer {
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  color: $light_font_color;
  font-size: 1rem;
  padding: 0.75rem 1rem 0.75rem;
  display: flex;
  flex-wrap: wrap;
  cursor: default;

  .actions-wrapper {
    display: flex;
    justify-content: space-evenly;
    flex-grow: 1;
    padding: 0 2.3rem;

    .action {
      svg {
        margin-bottom: 0.3rem;
        height: 0.9rem;
      }

      span {
        margin-left: 0.5rem;
      }

      &.active {
        color: #fff;
      }

      &.disabled {
        cursor: default;
      }
    }
  }
}

@media only screen and (max-width: 1024px) {
  .tip-record {
    position: relative;
  }
}

@media only screen and (max-width: 600px) {
  .tip-note {
    font-size: 0.75rem;
  }
}

@include smallest {
  .tip-body {
    padding: 0;
  }

  .tip-record {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    position: relative;

    .tip-body .tip-description .author-and-date ::v-deep {
      font-size: 0.6rem;
      padding-left: 0;
      padding-right: 0;

      img {
        height: 1.5rem;
        width: 1.5rem;
      }

      .address {
        font-size: 0.55rem;
      }
    }
  }

  .tip-note {
    padding: 0;
  }

  .tip-footer {
    font-size: 0.65rem;
    padding: 0.85rem 0 0 0;
  }
}
</style>
