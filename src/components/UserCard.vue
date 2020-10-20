<template>
  <div
    class="user-card"
    @mouseover="$emit('mouseover', $event)"
    @mouseleave="$emit('mouseleave', $event)"
  >
    <UserInfo :address="address" />
  </div>
</template>

<script>
import UserInfo from './UserInfo.vue';

export default {
  components: {
    UserInfo,
  },
  props: {
    address: { type: String, required: true },
  },
};
</script>

<style lang="scss" scoped>
.user-card {
  border: 1px solid $card_border_color;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: default;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
  background-color: $thumbnail_background_color;

  ::v-deep .profile__stats {
    display: grid;
    grid-template-columns: 8rem auto;

    .tip_stats {
      grid-auto-flow: row;
      order: 2;
    }

    .tips_stats_block {
      border: 0;
      border-bottom: 1px solid $light_color;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    .stats {
      border: 0;
      border-right: 1px solid $light_color;
      flex-direction: column;
      justify-content: space-around;
    }

    .stat_block {
      margin: 0;
    }
  }

  ::v-deep .profile__image {
    .avatar {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

  @include mobile {
    width: 100%;
  }
}
</style>
