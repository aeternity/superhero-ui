<template>
  <div class="footer-section">
    <div class="buttons">
      <OutlinedButton
        to="https://form.jotform.com/201075183408046"
        class="blue"
      >
        {{ $t('components.layout.FooterSection.Feedback') }}
      </OutlinedButton>
      <OutlinedButton
        to="https://thesuperherowallet.typeform.com/to/vh8Ffu"
        class="blue"
      >
        {{ $t('components.layout.FooterSection.Support') }}
      </OutlinedButton>
    </div>

    <div>
      {{ $t("components.layout.FooterSection.FooterInfo") }}
      <a
        href="https://github.com/aeternity/superhero-ui/"
        target="_blank"
        class="gh-link"
      >
        {{ $t('components.layout.FooterSection.ContributeOnGithub') }}
        &nbsp;<img src="../../assets/ghLogo.svg">
      </a>
    </div>

    <div>
      <div class="powered-by">
        {{ $t('components.layout.FooterSection.PoweredBy') }}
        <a
          href="https://aeternity.com/"
          target="_blank"
        >
          <img src="../../assets/aeternityLogo.svg">
        </a>
      </div>

      <a :href="`https://github.com/aeternity/superhero-ui/commit/${commitHash}`">
        {{ commitHash.slice(0, 7) }}
      </a>
      / {{ version }}
    </div>

    <div>
      <RouterLink to="/terms">
        {{ $t('components.layout.FooterSection.Terms') }}
      </RouterLink>
      <RouterLink to="/privacy">
        {{ $t('components.layout.FooterSection.Privacy') }}
      </RouterLink>
      <a
        class="venture"
        target="_blank"
        href="https://venture.com/"
      >
        <IconVenture /> <span>Branded by Venture</span>
      </a>
    </div>

    <OutlinedButton
      v-if="!isLoggedIn"
      :to="addressDeepLink"
      class="login-footer"
    >
      {{ $t('components.layout.FooterSection.LoginWithWallet') }}
    </OutlinedButton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createDeepLinkUrl } from '../../utils';
import OutlinedButton from '../OutlinedButton.vue';
import IconVenture from '../../assets/iconVenture.svg?icon-component';

export default {
  components: {
    OutlinedButton, IconVenture,
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
.footer-section {
  font-size: 0.55rem;
  text-align: center;

  > * {
    margin-bottom: 8px;
  }

  @include mobile {
    a {
      display: block;
    }
  }

  .buttons .outlined-button {
    &:first-of-type {
      margin-right: 1rem;
    }

    @include mobile {
      display: block;
      width: 100%;
      margin-bottom: 8px;
    }
  }

  .gh-link {
    img {
      height: 0.65rem;
      vertical-align: text-bottom;
    }

    &:hover img {
      filter: brightness(0.8);
    }
  }

  .venture {
    margin-left: 0.35rem;
    color: #cda564;
    letter-spacing: -0.045em;

    svg {
      height: 0.5rem;
    }

    svg,
    span {
      vertical-align: middle;
    }

    &:hover {
      filter: brightness(1.3);
    }
  }

  .powered-by {
    color: $standard_font_color;
    font-size: 0.7rem;

    a {
      &:hover {
        filter: brightness(1.3);
      }

      img {
        height: 0.55rem;
        vertical-align: middle;
      }
    }
  }

  .login-footer {
    line-height: 0.9rem;

    @include above-mobile {
      display: none;
    }

    a {
      padding: 0.625rem 1rem 0.625rem 1rem;
    }
  }
}
</style>
