<template>
  <div
    class="author-and-date"
    @click.stop
  >
    <Transition name="fade">
      <UserCard
        v-if="hover"
        :address="address"
        @mouseover.native="hover = true"
        @mouseleave.native="hover = false"
      />
    </Transition>
    <div class="info">
      <RouterLink
        :to="{
          name: 'user-profile',
          params: {
            address,
          },
        }"
      >
        <Avatar
          :address="address"
          @mouseover.native="hover = true"
          @mouseleave.native="hover = false"
        />
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
  </div>
</template>

<script>
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
    name: { type: String, default: '' },
  },
  data: () => ({ hover: false }),
};
</script>

<style lang="scss" scoped>
.author-and-date {
  position: relative;

  .info {
    align-items: center;
    color: $light_font_color;
    display: flex;
    font-size: 0.8rem;
    justify-content: space-between;
    padding: 0 1rem 0.9rem 1rem;

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

    .avatar {
      margin-right: 0.25rem;
    }

    a {
      color: $light_font_color;
      display: flex;
      margin-right: 1rem;
      overflow: hidden;

      &:hover {
        filter: brightness(1.3);
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter-to,
  .fade-leave-to {
    transition-delay: 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
