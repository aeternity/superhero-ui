<template>
  <Transition
    v-if="hover"
    name="fade"
  >
    <div
      v-show="show && isActive"
      class="modal-container"
      @click.stop
      @mouseover="mousestay"
      @mouseleave="mouseleave"
    >
      <UserInfo :address="address" />
    </div>
  </Transition>
</template>

<script>
import UserInfo from './UserInfo.vue';

export default {
  components: {
    UserInfo,
  },
  props: {
    address: { type: String, required: true },
    hover: Boolean,
    show: Boolean,
    isActive: Boolean,
    mouseover: { type: Function, required: true },
    mouseleave: { type: Function, required: true },
    mousestay: { type: Function, required: true },
  },
};
</script>

<style lang="scss" scoped>
.modal-container {
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
  .modal-container {
    width: 100%;
  }
}
</style>
