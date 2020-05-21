<template>
  <div class="footer">
    <div>
      <a
        href="https://form.jotform.com/201075183408046"
        target="_blank"
        class="feedback footer-btns"
      >
        {{ $t('components.layout.FooterSection.Feedback') }}
      </a>
      <a
        href="https://thesuperherowallet.typeform.com/to/vh8Ffu"
        target="_blank"
        class="footer-btns support"
      >
        {{ $t('components.layout.FooterSection.Support') }}
      </a>
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
    <div class="terms-links">
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
      <a
        class="venture"
        target="_blank"
        href="https://venture.com/"
      >
        <img src="../../assets/iconVenture.svg">
      </a>
    </div>
    <Dropdown
      :options="languageOptions"
      :method="setLang"
      :selected="language"
      class="footer-lang"
    >
      <img
        class="lang-icon"
        src="../../assets/iconLanguage.svg"
      >
    </Dropdown>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Dropdown from '../Dropdown.vue';
import { languageOptions } from '../../utils/util';
import { fetchAndSetLocale } from '../../utils/i18nHelper';

export default {
  name: 'FooterSection',
  components: {
    Dropdown,
  },
  data() {
    return {
      languageOptions,
    };
  },
  computed: mapGetters(['language']),
  methods: {
    ...mapActions(['setLanguage']),
    setLang(lang) {
      this.setLanguage(lang);
      fetchAndSetLocale(lang);
    },
  },
};
</script>

<style lang="scss">
  .footer {
    font-size: 0.55rem;
    text-align: center;

    .footer-btns {
      text-decoration: none;
      margin-bottom: 0.85rem;
      text-align: center;
      padding: 0.6rem;
      width: 8rem;
      display: inline-block;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 0.9rem;

      &:hover {
        color: $standard_font_color;
        border: 0.05rem solid $standard_font_color;
        cursor: pointer;
      }
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
      }

      &:hover {
        img {
          filter: brightness(0.8);
        }
      }
    }

    .footer-lang {
      margin-top: 0.85rem;
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
