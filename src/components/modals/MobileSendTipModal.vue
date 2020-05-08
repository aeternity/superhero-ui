<template>
  <div
    v-if="isTipModalOpen"
    class="send-tip__modal"
  >
    <div class="heading-section clearfix">
      <div class="title">
        <img src="../../assets/iconTip.svg">
        {{ $t('tip') }}
      </div>
      <div
        class="close-navigation"
        @click="toggleTipModal(false)"
      >
        &#x2715;
      </div>
    </div>
    <SendTip />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SendTip from '../layout/SendTip.vue';

export default {
  name: 'MobileSendTipModal',
  components: {
    SendTip,
  },
  computed: mapGetters(['isTipModalOpen']),
  methods: mapActions(['toggleTipModal']),
};
</script>

<style lang="scss">
.send-tip__modal {
  display: none;
}

@media only screen
  and (min-device-width: 320px)
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .send-tip__modal {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: $actions_ribbon_background_color;

    .tip__post__label {
      display: none;
    }

    .tip__post form .form-group {
      margin-bottom: 0.75rem;

      input,
      .input-group-text {
        height: 2.85rem;
      }
    }

    .input-group .form-control,
    .input-group-append,
    .input-group-text {
      height: 2.85rem;
    }

    .col-md-4 {
      padding-left: 0;
    }

    .tip__post form .tip__send {
      width: calc(100% - 2rem);
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
    }

    .heading-section {
      padding: 1rem 1.25rem;
      font-size: 1rem;
      color: $standard_font_color;
      background-color: $background_color;
      margin-bottom: 0.6125rem;

      img {
        height: 1.6rem;
        width: 1.6rem;
      }

      .close-navigation {
        display: inline-block;
        float: right;
      }
    }
  }
}
</style>
