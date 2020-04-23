<template>
  <div class="footer">
    <div>
      <a
        href="https://form.jotform.com/201075183408046"
        target="_blank"
        class="feedback footer-btns"
      >
        Give Feedback
      </a>
      <a
        href="https://thesuperherowallet.typeform.com/to/vh8Ffu"
        target="_blank"
        class="footer-btns support"
      >
        Support
      </a>
    </div>
    <div>
      SuperHero is Open Source. Powered by
      <a
        href="https://aeternity.com/"
        target="_blank"
        class="aeternity-logo"
      >
        <img src="../../assets/aeternityLogo.svg">
      </a>
    </div>
    <div class="terms-links">
      <router-link
        class="footer-links"
        to="/terms"
      >
        Terms
      </router-link>
      <router-link
        class="footer-links"
        to="/privacy"
      >
        Privacy
      </router-link>
      <a
        class="venture"
        target="_blank"
        href="https://venture.com/"
      >
        <img src="../../assets/iconVenture.svg">
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FooterSection',
};
</script>

<style lang="scss">
  .footer {
    font-size: 0.55rem;
    text-align: center;

    a {
      cursor: pointer;
      text-decoration: underline;

      &.footer-links {
        color: $standard_font_color;
        font-weight: lighter;
        text-decoration: none;
      }
    }

    .footer-btns {
      text-decoration: none;
      margin-bottom: 0.85rem;
      line-height: 0.9rem;
      text-align: center;
      padding-top: 0.6rem;
      padding-bottom: 0.7rem;
      width: 8rem;
      display: inline-block;
      border-radius: 0.25rem;
    }

    .support {
      border: 0.05rem solid $secondary_color;
      color: $secondary_color;
    }

    .feedback {
      border: 0.05rem solid $custom_links_color;
      color: $custom_links_color;
      margin-right: 1rem;
    }

    .feedback,
    .support {
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 0.9rem;

      &:hover {
        color: $standard_font_color;
        border: 0.05rem solid $standard_font_color;
        cursor: pointer;
      }
    }

    .aeternity-logo {
      img {
        height: 0.55rem;
      }

      &:hover {
        filter: brightness(1.3);
        cursor: pointer;
      }
    }

    .venture {
      margin-left: 0.35rem;

      img {
        height: 0.65rem;
      }

      &:hover {
        filter: brightness(1.3);
      }
    }

    .terms-links {
      margin-top: 0.85rem;
    }
  }
</style>
