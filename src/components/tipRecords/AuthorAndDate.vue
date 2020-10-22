<template>
  <div
    class="author-and-date"
    @click.stop
  >
    <RouterLink
      :to="{
        name: 'user-profile',
        params: {
          address,
        },
      }"
      class="router-link"
    >
      <div
        class="avatar-wrapper"
        @mouseover="hoverDebounced = true"
        @mouseleave="hoverDebounced = false"
      >
        <Avatar
          :address="address"
        />
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
    <span class="right">
      <FormatDate v-bind="$attrs" />
      <slot />
    </span>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { mapState } from 'vuex';
import FormatDate from './FormatDate.vue';
import Avatar from '../Avatar.vue';
import UserCard from '../UserCard.vue';

export default {
  components: {
    FormatDate,
    Avatar,
    UserCard,
  },
  props: {
    address: { type: String, required: true },
  },
  data: () => ({ hover: false }),
  computed: {
    hoverDebounced: {
      get() {
        return this.hover;
      },
      set: debounce(function set(hover) {
        this.hover = hover;
      }, 500),
    },
    ...mapState({
      name({ chainNames }) {
        return chainNames[this.address] || '';
      },
    }),
  },
};
</script>

<style lang="scss" scoped>
.author-and-date {
  align-items: center;
  color: $light_font_color;
  display: flex;
  font-size: 0.8rem;
  justify-content: space-between;
  padding: 0 1rem 0.9rem 1rem;

  .router-link {
    max-width: 80%;
  }

  .right {
    font-size: 0.65rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .address {
    font-size: 0.65rem;
  }

  .address,
  .chain-name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    word-break: break-all;
  }

  .avatar-wrapper {
    position: relative;

    .avatar {
      margin-right: 0.25rem;
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

  a {
    color: $light_font_color;
    display: flex;
    margin-right: 1rem;

    &:hover {
      .avatar,
      .author-name {
        filter: brightness(1.3);
      }
    }
  }

  .chain-name {
    color: #fff;
  }

  .author-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
}
</style>
