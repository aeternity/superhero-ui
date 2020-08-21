<template>
  <div
    class="tip__record row position-relative comment"
    @click="goToCommentPage(comment.tipId, comment.id)"
  >
    <div class="tip__body">
      <div class="clearfix">
        <div
          class="tip__author"
          :title="comment.author"
        >
          <span
            class="user-display"
            @click.stop
          >
            <router-link
              :to="{
                name: 'user-profile',
                params: {
                  address: comment.author,
                },
              }"
            >
              <Avatar :address="comment.author" />
              <span
                v-if="userChainName"
                class="chain__name"
              >
                {{ userChainName }}
              </span>
              <span
                v-else-if="comment.chainName"
                class="chain__name"
              >
                {{ comment.chainName }}
              </span>
              <span
                v-else
                :address="comment.author"
                class="address"
              >
                {{ comment.author }}
              </span>
            </router-link>
          </span>
          <FormatDate
            class="tip__date"
            :date-timestamp="new Date(comment.createdAt)"
          />
        </div>
      </div>
      <div
        class="tip__note"
        :title="comment.text"
      >
        {{ comment.text }}
      </div>
      <div class="comment__actions">
        <span @click.stop>
          <TipInput :comment="comment" />
        </span>
        <span
          :title="$t('components.tipRecords.TipComment.Replies')"
          class="comments"
        >
          <img src="../../assets/iconReply.svg">
          &nbsp;<span>{{ childComments }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FormatDate from './FormatDate.vue';
import Avatar from '../Avatar.vue';
import TipInput from '../TipInput.vue';

export default {
  name: 'TipComment',
  components: {
    FormatDate,
    Avatar,
    TipInput,
  },
  props: {
    comment: { type: Object, required: true },
  },
  computed: {
    ...mapState(['chainNames']),
    userChainName() {
      return this.chainNames[this.comment.author];
    },
    childComments() {
      if (this.comment && this.comment.children) {
        return this.comment.children.length;
      }
      return 0;
    },
  },
  methods: {
    goToCommentPage(tipId, id) {
      this.$router.push({
        name: 'comment',
        params: {
          tipId,
          id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.comment.tip__record {
  margin: 0 0 0.15rem 0;
  padding-bottom: 0;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  background-color: $light_color;

  .tip__body .tip__note {
    padding: 0.35rem 1rem 0.25rem 1rem;
    color: $comment_text_color;
    height: initial;
    font-size: 0.7rem;
    font-weight: 400;
    margin: 0;
  }

  .tip__author {
    padding-bottom: 0;
  }
}

.tip__author {
  align-items: center;
  color: $light_font_color;
  display: flex;
  font-size: 0.8rem;
  justify-content: space-between;

  .tip__date {
    font-size: 0.6rem;
    text-align: right;
  }

  .user-display {
    max-width: 85%;
  }

  .address {
    font-size: 0.6rem;
  }

  .address,
  .chain__name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    word-break: break-all;
  }

  img {
    border-radius: 50%;
    flex-shrink: 0;
    height: 2rem;
    margin-right: 0.25rem;
    object-fit: cover;
    width: 2rem;
  }

  a {
    align-items: center;
    color: $light_font_color;
    display: flex;
    margin-right: 1rem;
    overflow: hidden;

    &:hover {
      filter: brightness(1.3);
    }
  }

  .chain__name {
    color: #fff;
  }
}

.comment__actions {
  padding: 0.25rem 1rem 1rem 1rem;
  color: $standard_font_color;
  font-size: 0.8rem;
  display: flex;
  align-items: center;

  img {
    height: 0.7rem;
  }
}

.comments {
  margin-left: 3rem;

  > * {
    vertical-align: middle;
  }
}

@include smallest {
  .comment.tip__record {
    padding: 0.5rem;

    .tip__body {
      padding-left: 0;

      .tip__note {
        margin-top: 0.25rem;
        margin-bottom: 0;
        padding: 0;
      }
    }

    .comment__actions {
      padding-left: 0;
      padding-top: 0.5rem;
    }
  }
}
</style>
