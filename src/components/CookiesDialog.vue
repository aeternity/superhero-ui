<template>
  <div
    class="cookies-dialog"
    @click.stop
  >
    <ButtonPlain
      class="button-cancel"
      @click="$emit('close', $event)"
    >
      <IconCancel />
    </ButtonPlain>
    <CookieImg class="cookie-img" />
    <div class="info">
      Superhero.com respects your privacy. Third-party tracking cookies are blocked by default.
      In order to play content such as video or audio
      you have to allow third-party cookies by content provider.
    </div>
    <div>
      <ButtonPlain
        class="cookies-button"
        @click="setCookies({ scope, status: true })"
      >
        Allow {{ scope }}
      </ButtonPlain>
      <ButtonPlain
        v-if="address"
        class="cookies-button"
        :to="{ name: 'user-profile', params: { address } }"
      >
        Customize policy
      </ButtonPlain>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ButtonPlain from './ButtonPlain.vue';
import CookieImg from '../assets/cookieImg.svg?icon-component';
import IconCancel from '../assets/iconCancel.svg?icon-component';

export default {
  components: { ButtonPlain, CookieImg, IconCancel },
  props: { scope: { type: String, required: true } },
  computed: mapState(['address']),
  methods: mapActions('backend', ['setCookies']),
};
</script>

<style lang="scss" scoped>
.cookies-dialog {
  position: absolute;
  z-index: 9;
  left: -4%;
  background-color: $buttons_background;
  border: 1px solid $article_content_color;
  border-radius: 0.25rem;
  width: 108%;
  padding: 1rem;
  cursor: default;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .button-cancel {
    position: absolute;
    right: 0;
    top: 0;
    color: $tip_note_color;

    svg {
      height: 1.9rem;
    }
  }

  .cookie-img {
    height: 2.5rem;
  }

  .info {
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: center;
  }

  .cookies-button {
    border: 1px solid $secondary_color;
    border-radius: 0.25rem;
    font-weight: 500;
    color: $secondary_color;
    padding: 0.35rem 0.7rem;
    background-color: $buttons_background;
    margin: 0.5rem 0.5rem 0.5rem 0;

    &:hover {
      background-color: #1161fe50;
    }
  }
}
</style>
