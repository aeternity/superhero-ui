<template>
  <div class="wrapper">
    <Transition
      v-if="hover"
      name="fade"
    >
      <div
        v-show="show"
        class="modal-container"
        @click.stop
        @mouseover="mousestay"
        @mouseleave="mouseleave"
      >
        <UserInfo

          :address="address"
        />
      </div>
    </Transition>
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
      >
        <Avatar
          :address="address"
          @mouseover.native="mouseover"
          @mouseleave.native="mouseleave"
        />
        <div class="author-name">
          <span
            v-if="name"
            class="chain-name"
          >
            {{ name }}
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
import UserInfo from '../UserInfo.vue';

let timeout;

export default {
  components: {
    FormatDate,
    Avatar,
    UserInfo,
  },
  props: {
    address: { type: String, required: true },
    name: { type: String, default: '' },
  },
  data() {
    return {
      hover: false,
      show: false,
    };
  },
  methods: {
    mouseover() {
      this.hover = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => { this.show = true; }, 1000);
    },
    mouseleave() {
      timeout = setTimeout(() => { this.hover = false; this.show = false; }, 750);
    },
    mousestay() {
      this.hover = true;
      this.show = true;
      clearTimeout(timeout);
    },
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

.wrapper {
  position: relative;
}

.modal-container {
  top: 60px;
  border: 1px solid $light_font_color;
  border-radius: 0.5rem;
  position: absolute;
  z-index: 99;
  overflow: hidden;
  cursor: default;
  width: 75%;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.7);
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

@media screen and (max-width: 1024px) {
  .modal-container {
    width: 100%;
  }
}
</style>
