<template>
  <div class="footer">
    <div class="footer-btns">
      <OutlinedButton
        :to="'https://form.jotform.com/201075183408046'"
        class="blue feedback"
      >
        {{ $t('components.layout.FooterSection.Feedback') }}
      </OutlinedButton>
      <OutlinedButton
        :to="'https://thesuperherowallet.typeform.com/to/vh8Ffu'"
        class="blue"
      >
        {{ $t('components.layout.FooterSection.Support') }}
      </OutlinedButton>
    </div>
    <div>
      <p>
        {{ $t("components.layout.FooterSection.FooterInfo") }}
        <a
          href="https://github.com/aeternity/superhero-ui/"
          target="_blank"
          class="gh-link"
        >
          {{ $t('components.layout.FooterSection.ContributeOnGithub') }}
          <img src="../../assets/ghLogo.svg">
        </a>
      </p>
      <p>
        <div class="powered-by">
        {{ $t('components.layout.Overview.PoweredBy') }}
        <a href="https://aeternity.com/" target="_blank">
          <img style="max-height:12px;" src="../../assets/aeternityLogo.svg">
        </a>
    </div>
      </p>
    </div>
    <span>
      <a :href="`https://github.com/aeternity/superhero-ui/commit/${commitHash}`">
        {{ commitHash.slice(0, 7) }}
      </a><!--eslint-disable-line vue-i18n/no-raw-text-->
      / {{ version }}
    </span>
    <div class="terms-links">
      <RouterLink
        class="footer-links"
        to="/terms"
      >
        {{ $t('components.layout.FooterSection.Terms') }}
      </RouterLink>
      <RouterLink
        class="footer-links"
        to="/privacy"
      >
        {{ $t('components.layout.FooterSection.Privacy') }}
      </RouterLink>
      <a
        class="venture"
        target="_blank"
        href="https://venture.com/"
      >
        <img src="../../assets/iconVenture.svg">
      </a>
    </div>
    
    <div
      v-if="!isLoggedIn"
      class="login-footer"
    >
      <OutlinedButton :to="addressDeepLink">
        {{ $t('components.layout.FooterSection.LoginWithWallet') }}
      </OutlinedButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createDeepLinkUrl } from '../../utils';
import OutlinedButton from '../OutlinedButton.vue';

export default {
  components: {
    OutlinedButton,
  },
  data: () => ({
    version: process.env.npm_package_version,
    commitHash: process.env.COMMIT_HASH,
    addressDeepLink: createDeepLinkUrl({
      type: 'address',
      'x-success': `${window.location}?address={address}`,
    }),
  }),
  computed: mapGetters(['isLoggedIn']),
};
</script>

<style lang="scss" scoped>
  .footer {
    font-size: 0.55rem;
    text-align: center;

    .feedback {
      margin-right: 1rem;
    }

    .footer-btns {
      margin-bottom: 0.85rem;
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

    .gh-link {
      img {
        width: 0.65rem;
        height: 0.65rem;
        vertical-align: text-bottom;
      }

      &:hover {
        img {
          filter: brightness(0.8);
        }
      }
    }

    .login-footer {
      display: none;
      line-height: 0.9rem;
      margin-top: 0.4rem;

      a {
        padding: 0.625rem 1rem 0.625rem 1rem;
      }
    }
  }

  @media (max-width: 1024px) {
    .footer .login-footer {
      display: block;
    }
  }

  @media (max-height: 595px) {
    p {
      margin-bottom: 0.4rem;
    }

    .footer {
      .footer-btns {
        margin-bottom: 0.4rem;
      }

      .terms-links {
        margin-top: 0.4rem;
      }
    }
  }
</style>
