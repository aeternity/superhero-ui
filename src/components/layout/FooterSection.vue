<template>
  <div class="footer">
    <div class="terms-links">
      <router-link
        class="footer-links"
        to="/tutorial"
      >
        {{ $t('components.layout.FooterSection.HowItWorks') }}
      </router-link>
      <a
        href="https://form.jotform.com/201075183408046"
        target="_blank"
        class="footer-links"
      >
        {{ $t('components.layout.FooterSection.Feedback') }}
      </a>
      <a
        href="https://thesuperherowallet.typeform.com/to/vh8Ffu"
        target="_blank"
        class="footer-links"
      >
        {{ $t('components.layout.FooterSection.Support') }}
      </a>
      <router-link
        class="footer-links"
        to="/terms"
      >
        {{ $t('components.layout.FooterSection.Terms') }}
      </router-link>
      <router-link
        class="footer-links"
        to="/privacy"
      >
        {{ $t('components.layout.FooterSection.Privacy') }}
      </router-link>
    </div>
    <div>
      <i18n
        path="components.layout.FooterSection.FooterInfo"
        tag="p"
      >
        <template v-slot:openSource>
          <a
            href="https://github.com/aeternity/superhero-ui/"
            target="_blank"
            class="gh-link"
          >
            {{ $t('components.layout.FooterSection.ContributeOnGithub') }}
            <img src="../../assets/ghLogo.svg">
          </a>
        </template>
      </i18n>
    </div>
    <div class="venture">
      <a
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

    .venture {
      margin-top: -0.5rem;

      img {
        height: 0.65rem;
      }

      &:hover {
        filter: brightness(1.3);
      }
    }

    .terms-links {
      margin: 0.5rem 0;

      a {
        margin-right: 0.8rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .gh-link {
      img {
        width: 0.65rem;
        height: 0.65rem;
      }

      &:hover {
        img {
          filter: brightness(0.8);
        }
      }
    }
  }
</style>
