<template>
  <div class="author-and-date">
    <UserCard
      v-if="hover && isActive"
      :address="address"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    />
    <div
      class="author-and-date-info"
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
    parrent: { type: String, default: '' },
  },
  data() {
    return {
      hover: false,
      timeout: null,
    };
  },
  computed: {
    ...mapState(['showUserCardTag']),
    currentUserInfo() {
      return this.address + this.parrent;
    },
    isActive() {
      return this.currentUserInfo === this.showUserCardTag;
    },
  },
  methods: {
    ...mapMutations(['setShowUserCardTag']),
    mouseover() {
      this.setShowUserCardTag(this.currentUserInfo);
      this.hover = true;
      clearTimeout(this.timeout);
    },
    mouseleave() {
      this.timeout = setTimeout(() => { this.hover = false; }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.author-and-date-info {
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

.author-and-date {
  position: relative;
}
</style>
