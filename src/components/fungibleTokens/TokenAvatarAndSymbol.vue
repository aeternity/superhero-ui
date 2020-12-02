<template>
  <div class="token-avatar-and-symbol">
    <Avatar
      v-if="tokenData"
      :address="address"
      show-identicon-only
    />
    <img
      v-else
      src="../../assets/aeternitySymbol.svg"
      class="aeternity-logo"
    />
    <!--eslint-disable-next-line vue-i18n/no-raw-text-->
    <span class="symbol">{{ tokenData ? tokenData.symbol : 'AE' }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Avatar from '../Avatar.vue';

export default {
  components: { Avatar },
  props: {
    address: { type: String, required: true },
  },
  computed: {
    ...mapState({
      tokenData({ tokenInfo }) {
        return tokenInfo[this.address] || null;
      },
    }),
  },
};
</script>

<style lang="scss" scoped>
.token-avatar-and-symbol {
  display: flex;
  align-items: center;

  .symbol {
    font-size: 0.75rem;
    color: $secondary_color;
    margin-left: 0.4rem;
  }

  .aeternity-logo {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    padding: 4px;
    object-fit: contain;
    background: $article_content_color;
    border-radius: 50%;
  }

  .avatar {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
