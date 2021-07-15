<template>
  <Transition @after-leave="popper.destroy()">
    <UserInfo
      v-if="visible"
      class="user-popup"
      :address="address"
      @mouseenter.native="enterHandler"
      @mouseleave.native="leaveHandler"
    />
  </Transition>
</template>

<script>
import { debounce } from 'lodash-es';
import { createPopper } from '@popperjs/core';
import UserInfo from './UserInfo.vue';

export default {
  components: { UserInfo },
  props: {
    reference: { type: Element, required: true },
    address: { type: String, required: true },
    resolve: { type: Function, required: true },
  },
  data: () => ({
    popper: null,
    setVisibility: null,
    visible: false,
  }),
  mounted() {
    this.setVisibility = debounce(this.setVisibilityDirectly, 500);
    this.setVisibility(true);
    this.reference.addEventListener('mouseenter', this.enterHandler);
    this.reference.addEventListener('mouseleave', this.leaveHandler);
    this.$on('hook:beforeDestroy', () => {
      this.reference.removeEventListener('mouseenter', this.enterHandler);
      this.reference.removeEventListener('mouseleave', this.leaveHandler);
    });
  },
  methods: {
    enterHandler() {
      this.setVisibility(true);
    },
    leaveHandler() {
      this.setVisibility(false);
    },
    setVisibilityDirectly(isVisible) {
      if (!isVisible) {
        this.resolve();
        return;
      }
      if (this.visible) return;
      this.visible = true;
      this.$nextTick(() => {
        this.popper = createPopper(this.reference, this.$el, {
          placement: 'bottom-start',
          modifiers: [{
            name: 'flip',
            options: {
              fallbackPlacements: ['top-start'],
            },
          }],
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-popup {
  border: 1px solid $card_border_color;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
  background-color: $thumbnail_background_color;
  max-width: 450px;

  @include mobile {
    max-width: 350px;
  }

  &.v-enter-active,
  &.v-leave-active {
    transition: opacity 0.3s;
  }

  &.v-enter,
  &.v-leave-to {
    opacity: 0;
  }

  ::v-deep .profile-stats {
    display: grid;
    grid-template-columns: 8rem auto;

    .tip-stats {
      grid-auto-flow: row;
      order: 2;
    }

    .tips-stats-block {
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

    .stat-block {
      margin: 0;
    }
  }

  ::v-deep .profile-image .avatar {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>
