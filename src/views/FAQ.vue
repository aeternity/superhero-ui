<template>
  <div>
    <mobile-navigation />
    <right-section />
    <left-section />
    <div class="container wrapper mt-2">
      <div class="content faq-page">
        <h1>{{ $t('views.FAQ.header') }}</h1>
        <hr width="30%">
        <i18n path="views.FAQ.subheader" tag="p">
          <template v-slot:router>
            <router-link to="/tutorial">
              {{ $t('views.FAQ.tutorialPage') }}
            </router-link>
          </template>
        </i18n>
        <expandable-block :title="$t('views.FAQ.question_1')">
          <i18n path="views.FAQ.question_1_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_2')">
          <i18n path="views.FAQ.question_2_info" tag="p">
            <template v-slot:aeternitycom>
              <a href="https://aeternity.com/" target="_blank" > {{ $t('views.FAQ.aeternityBlockchain') }} </a>
            </template>
            <template v-slot:sup>
              3<sup>rd</sup>
            </template>
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_3')">
          <i18n path="views.FAQ.question_3_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_4')">
          <i18n path="views.FAQ.question_4_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_5')">
          <i18n path="views.FAQ.question_5_info" tag="p">
            <template v-slot:router>
              <router-link
                :to="{ name: 'tutorial' }"
                target="_blank"
              >
                {{ $t('views.FAQ.ourTutorial') }}
              </router-link>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_6')">
          <i18n path="views.FAQ.question_6_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_7')">
          <i18n path="views.FAQ.question_7_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_8')">
          {{ $t('views.FAQ.question_8_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_9')">
          {{ $t('views.FAQ.question_9_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_10')">
          {{ $t('views.FAQ.question_10_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_11')">
          {{ $t('views.FAQ.question_11_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_12')">
          <i18n path="views.FAQ.question_12_info" tag="p">
            <template v-slot:router>
              <router-link
                v-slot="{ href }"
                to="/tutorial"
              >
                <a
                  :href="href"
                  target="_blank"
                >
                  {{ $t('views.FAQ.tutorial') }}
                </a>
              </router-link>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_13')">
          {{ $t('views.FAQ.question_13_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_14')">
          <i18n path="views.FAQ.question_14_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_15')">
          <i18n path="views.FAQ.question_15_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_16')">
          {{ $t('views.FAQ.question_16_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_17')">
          {{ $t('views.FAQ.question_17_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_18')">
          {{ $t('views.FAQ.question_18_info') }}
        </expandable-block>
        <expandable-block :title="$t('views.FAQ.question_19')">
          <i18n path="views.FAQ.question_19_info" tag="p">
            <template v-slot:br>
              <br>
            </template>
          </i18n>
          <i18n path="views.FAQ.question_19_info" tag="p">
            <template v-slot:a>
              <a
                href="https://form.jotform.com/201075183408046"
                target="_blank"
              >
                {{ $t('views.FAQ.feedbackForm') }}, </a>
            </template>
          </i18n>
        </expandable-block>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSection from '../components/layout/LeftSection.vue';
import RightSection from '../components/layout/RightSection.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';
import MobileNavigation from '../components/layout/MobileNavigation.vue';

export default {
  name: 'FAQ',
  components: {
    LeftSection,
    RightSection,
    ExpandableBlock,
    MobileNavigation,
  },
};
</script>

<style lang="scss">
.faq-page,
.tutorial-page {
  background-color: $light_color;
  padding: 2rem;
  margin-top: 0.75rem;

  h1 {
    font-size: 1.5rem;
    color: $standard_font_color;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.8rem;
    color: $text_content_color;
  }

  h1,
  p {
    text-align: center;
  }

  a {
    color: $custom_links_color;

    &:hover {
      filter: saturate(0.5) brightness(1.2);
    }
  }

  hr {
    background: $search_nav_border_color;
    margin-bottom: 1rem;
  }
}
</style>
