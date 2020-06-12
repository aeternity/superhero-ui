<template>
  <Page>
    <div class="faq-page">
      <h1>{{ $t('views.FAQ.header') }}</h1>
      <hr width="30%">
      <i18n
        path="views.FAQ.subheader"
        tag="p"
      >
        <template v-slot:tutorialPage>
          <router-link to="/tutorial">
            {{ $t('views.FAQ.tutorialPage') }}
          </router-link>
        </template>
      </i18n>

      <ExpandableBlock
        v-for="(item, index) in $t('views.FAQ.questions').length"
        :key="index"
        :title="$t('views.FAQ.questions')[index].title"
      >
        <i18n
          :path="`views.FAQ.questions[${index}].text`"
          tag="p"
        >
          <template v-slot:aeternityCom>
            <a
              href="https://aeternity.com/"
              target="_blank"
            >
              {{ $t('views.FAQ.aeternityBlockchain') }}
            </a>
          </template>
          <template v-slot:ourTutorial>
            <router-link
              :to="{ name: 'tutorial' }"
              target="_blank"
            >
              {{ $t('views.FAQ.ourTutorial') }}
            </router-link>
          </template>
          <template v-slot:tutorial>
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
          <template v-slot:feedbackForm>
            <a
              href="https://form.jotform.com/201075183408046"
              target="_blank"
            >
              {{ $t('views.FAQ.feedbackForm') }}
            </a>
          </template>
          <template v-slot:forum>
            <a
              href="https://forum.aeternity.com/"
              target="_blank"
            > {{ $t('views.FAQ.forum') }} </a>
          </template>
          <template v-slot:br>
            <br>
          </template>
        </i18n>
      </ExpandableBlock>
    </div>
  </Page>
</template>

<script>
import Page from '../components/layout/Page.vue';
import ExpandableBlock from '../components/ExpandableBlock.vue';

export default {
  name: 'FAQ',
  components: {
    Page,
    ExpandableBlock,
  },
};
</script>

<style lang="scss">
.faq-page,
.mission-page,
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
