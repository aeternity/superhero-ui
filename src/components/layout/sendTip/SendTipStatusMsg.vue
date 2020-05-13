<template>
  <div
    class="status-message"
    :class="{ error: !status }"
  >
    <img :src="status ? SuccessIcon : ErrorIcon">
    <h1 class="sent-tip-header">
      {{
        status ? $t('components.layout.SendTip.SuccessHeader')
        : $t('components.layout.SendTip.ErrorHeader')
      }}
    </h1>
    <p class="sent-tip-text">
      {{
        status ? $t('components.layout.SendTip.SuccessText')
        : $t('components.layout.SendTip.ErrorText')
      }}
    </p>
  </div>
</template>

<script>
import SuccessIcon from '../../../assets/iconTipped.svg';
import ErrorIcon from '../../../assets/iconError.svg';

export default {
  name: 'SendTipStatusMsg',
  props: {
    status: { type: Boolean },
  },
  data() {
    return {
      SuccessIcon,
      ErrorIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
  .sent-tip-header {
    color: $standard_font_color;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
  }

  .sent-tip-text {
    color: $custom_links_color;
    font-size: 0.75rem;
    font-weight: 400;
  }

  .status-message {
    text-align: center;
    padding: 3.9rem 0;

    img {
      margin-bottom: 0.85rem;
      height: 2.1rem;
    }

    &.error {
      img {
        height: 1.5rem;
      }

      p {
        color: $red_color;
      }
    }
  }
</style>
