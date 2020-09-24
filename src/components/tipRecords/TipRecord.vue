<template>
  <div
    class="tip__record row"
    @click="goToTip"
  >
    <div class="tip__body">
      <div class="tip__description">
        <AuthorAndDate
          :date="new Date(tip.timestamp)"
          :address="tip.sender"
          :name="tip.chainName"
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
      <div
        class="tip__note pr-2"
        @click.stop
      >
        <TipTitle :tip-title="tip.title" />
      </div>
      <TipPreview
        :tip="tip"
        :go-to-tip="goToTip"
      />
      <div class="tip__footer">
        <div class="tip__footer_wrapper">
          <div
            class="tip__comments"
            :class="[{ 'tip__comments--hascomments': tip.commentCount }]"
          >
            <img
              class="comment__icon"
              src="../../assets/commentsIcon.svg"
            >
            <span>{{ tip.commentCount }}</span>
          </div>
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
import TipPreview from './TipPreview.vue';
import ThreeDotsMenu from '../ThreeDotsMenu.vue';
import AuthorAndDate from './AuthorAndDate.vue';

export default {
  components: {
    TipTitle,
    TipPreview,
    ThreeDotsMenu,
    AuthorAndDate,
  },
  mixins: [backendAuthMixin(true)],
  props: {
    tip: { type: Object, required: true },
  },
  computed: {
    ...mapState(['address', 'useSdkWallet']),
    ...mapState({
      isTipPinned({ pinnedItems }) {
        return pinnedItems.some(({ id }) => id === this.tip.id);
      },
    }),
    toTip() {
      return { name: 'tip', params: { tipId: this.tip.id } };
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
      return this.$route.params.tipId === this.tip.id
        ? window.open(this.tip.url)
        : this.$router.push(this.toTip);
    },
  },
};
</script>

<style lang="scss" scoped>
  .tip__record {
    background-color: $light_color;
    margin: 0 0 0.15rem 0;

    &:hover {
      cursor: pointer;
    }
  }

  .tip__body {
    padding-top: 1rem;
    width: 100%;
  }

  .tip-title {
    @include truncate-overflow-mx(4);

    color: $tip_note_color;
    font-size: 0.85rem;
    line-height: 1.1rem;
    margin-bottom: 0.8rem;
    padding-left: 1rem;
    padding-right: 0.5rem;
  }

  .retip__icon {
    height: 1rem;
    margin-right: 0.2rem;
    vertical-align: top;
    padding: 0.1rem 0;
    width: 1rem;
  }

  .comment__icon {
    margin-right: 0.2rem;
    vertical-align: top;
  }

  .tip__footer {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    color: $light_font_color;
    font-size: 0.8rem;
    padding: 1.4rem 1rem 0.75rem;
  }

  .tip__footer_wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tip__comments {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    height: 1rem;
    cursor: pointer;
    position: relative;
    width: max-content;

    &.tip__comments--hascomments {
      color: #fff;
    }
  }

  .tip__comments:hover img {
    filter: brightness(1.3);
  }

  @media only screen and (max-width: 1024px) {
    .tip__record {
      position: relative;
    }
  }

  @media only screen and (max-width: 600px) {
    .tip-title {
      font-size: 0.75rem;
    }

    .tip__footer .tip__amount img {
      width: 0.7rem;
    }
  }

  @include smallest {
    .tip__body {
      padding: 0;
    }

    .tip__record {
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      position: relative;

      .tip__body .tip__description .author-and-date ::v-deep {
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

    .tip__note {
      padding: 0;
    }

    .tip__footer {
      font-size: 0.65rem;
      padding: 0.85rem 0 0 0;

      .tip__amount img {
        width: 1rem;
      }
    }
  }
</style>
