<template>
  <RouterLink
    :to="{ name: 'user-profile', params: { address } }"
    class="author"
    @mouseover.native="hoverDebounced = true"
    @mouseleave.native="hoverDebounced = false"
  >
    <div class="avatar-wrapper">
      <Avatar :address="address" />
      <Transition name="fade">
        <UserCard
          v-if="hoverDebounced"
          :address="address"
        />
      </Transition>
    </div>
    <div class="author-name">
      <span class="chain-name">
        {{ name ? name : $t('FellowSuperhero') }}
      </span>
      <span class="address">
        {{ address }}
      </span>
    </div>
  </RouterLink>
</template>

<script>
import { debounce } from 'lodash-es';
import Backend from '../../utils/backend';
import Avatar from '../Avatar.vue';
import UserCard from '../UserCard.vue';

export default {
  components: { Avatar, UserCard },
  props: {
    address: { type: String, required: true },
  },
  data: () => ({ hover: false, name: null }),
  computed: {
    hoverDebounced: {
      get() {
        return this.hover;
      },
      set: debounce(function set(hover) {
        this.hover = hover;
      }, 500),
    },
  },
  async mounted() {
    const profile = await Backend.getProfile(this.address);
    this.name = profile ? profile.preferredChainName : null;
  },
};
</script>

<style lang="scss" scoped>
.author {
  display: flex;

  &:hover {
    .avatar,
    .author-name {
      filter: brightness(1.3);
    }
  }

  .avatar-wrapper {
    position: relative;

    .avatar {
      margin-right: 0.25rem;
      display: block;
    }

    .user-card {
      position: absolute;
      width: 450px;
      z-index: 10;

      @include mobile {
        width: 350px;
      }

      &.fade-enter-active,
      &.fade-leave-active {
        transition: opacity 0.3s;
      }

      &.fade-enter,
      &.fade-leave-to {
        opacity: 0;
      }
    }
  }

  .author-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .address,
    .chain-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chain-name {
      font-size: 0.8rem;
      color: #fff;
    }

    .address {
      font-size: 0.65rem;
      color: $light_font_color;
    }
  }
}
</style>
