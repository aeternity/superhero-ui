<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div
    class="cookies-dialog"
    @click.stop
  >
    <img src="../assets/cookieImg.svg">
    <div class="info">
      Superhero.com respects your privacy. Third-party tracking cookies are blocked by default.
      In order to play content such as video or audio
      you have to allow third-party cookies by content provider.
    </div>
    <div>
      <button
        class="cookies-button"
        @click="allow"
      >
        Allow {{ scope }}
      </button>
      <RouterLink
        v-if="address"
        class="cookies-button"
        :to="`/user-profile/${address}`"
      >
        Customize policy
      </RouterLink>
    </div>
  </div>
</template>

<script>
import backendAuthMixin from '../utils/backendAuthMixin';

export default {
  mixins: [backendAuthMixin()],
  props: { address: { type: String, default: '' }, scope: { type: String, required: true } },
  methods: {
    async allow() {
      await this.backendAuth(`setCookies${this.scope}`, {
        scope: this.scope,
        status: 'ALLOWED',
      });
      await this.backendAuth('getCookiesList').then((list) => {
        this.$store.commit('setCookiesList', list);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cookies-dialog {
  position: absolute;
  z-index: 9;
  left: -4%;
  background-color: $buttons_background;
  border: 1px solid $article_content_color;
  border-radius: 0.5rem;
  width: 108%;
  padding: 1rem;
  cursor: default;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    height: 2.5rem;
    width: auto;
  }

  .info {
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: center;
  }
}

.cookies-button {
  border: 1px solid $secondary_color;
  border-radius: 0.5rem;
  font-weight: 500;
  color: $secondary_color;
  display: inline-block;
  padding: 0.35rem 0.7rem;
  background-color: $buttons_background;
  margin: 0.5rem 0.5rem 0.5rem 0;

  &:hover {
    background-color: #2a9cff50;
  }

  &:focus {
    outline: none;
  }
}
</style>
