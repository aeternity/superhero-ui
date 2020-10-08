<template>
  <div
    class="user-card"
    @click.stop
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
  top: 60px;
  width: 75%;
  border: 1px solid $card_border_color;
  border-radius: 0.5rem;
  position: absolute;
  z-index: 99;
  overflow: hidden;
  cursor: default;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
  background-color: $thumbnail_background_color;
  animation: fadeIn 1s ease;

  @keyframes fadeIn {
    0% { opacity: 0; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
}

::v-deep .profile__stats {
  display: grid;
  grid-template-columns: 8rem auto;

  .tip_stats {
    grid-template-columns: auto;
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

@media screen and (max-width: 1024px) {
  .user-card {
    width: 100%;
  }
}
</style>
