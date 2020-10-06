<template>
  <div class="wrapper">
    <UserHoverCard
      :address="address"
      :hover="hover"
      :show="show"
      :is-active="isActive"
      :mouseover="mouseover"
      :mouseleave="mouseleave"
      :mousestay="mousestay"
    />
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
import { mapMutations, mapState } from 'vuex';
import FormatDate from './FormatDate.vue';
import Avatar from '../Avatar.vue';
import UserHoverCard from '../UserHoverCard.vue';

let timeout;

export default {
  components: {
    FormatDate,
    Avatar,
    UserHoverCard,
  },
  props: {
    address: { type: String, required: true },
    name: { type: String, default: '' },
    parrent: { type: String, default: '' },
  },
  data() {
    return {
      hover: false,
      show: false,
    };
  },
  computed: {
    ...mapState(['showUserInfo']),
    currentUserInfo() {
      return this.address + this.parrent;
    },
    isActive() {
      return this.currentUserInfo === this.showUserInfo;
    },
  },
  methods: {
    ...mapMutations(['setShowUserInfo']),
    mouseover() {
      this.setShowUserInfo(this.currentUserInfo);
      this.hover = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => { this.show = true; }, 500);
    },
    mouseleave() {
      timeout = setTimeout(() => { this.hover = false; this.show = false; }, 500);
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
</style>
