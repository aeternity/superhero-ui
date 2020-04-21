<template>
  <div class="footer">
    SuperHero is Open Source
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
    <div>
      <a
        href="https://form.jotform.com/201075183408046"
        target="_blank"
        class="feedback footer-btns"
      >
        Give Feedback
      </a>
      <a
        class="footer-btns venture"
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
    font-size: 0.6rem;
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
      margin-top: 1.3rem;
      line-height: 0.9rem;
      text-align: center;
      padding-top: 0.6rem;
      padding-bottom: 0.7rem;
      width: 7rem;
      display: inline-block;
      border-radius: 0.25rem;
    }

    .venture {
      border: 0.05rem solid $standard_font_color;

      img {
        width: 6rem;
      }

      &:hover {
        filter: brightness(1.3);
      }
    }

    .feedback {
      background-color: $custom_links_color;
      color: $background_color;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 1rem;

      &:hover {
        background-color: $secondary_color;
        cursor: pointer;
      }
    }
  }
</style>
