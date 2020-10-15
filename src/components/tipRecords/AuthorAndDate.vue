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
    >
      <Avatar :address="address" />
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
      <slot />
      <FormatDate v-bind="$attrs" />
    </span>
  </div>
</template>

<script>
import FormatDate from './FormatDate.vue';
import Avatar from '../Avatar.vue';

export default {
  components: {
    FormatDate,
    Avatar,
  },
  props: {
    address: { type: String, required: true },
    name: { type: String, default: '' },
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
</style>
