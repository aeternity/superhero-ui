import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '../locales/en.json';

Vue.use(VueI18n);

const fallbackLocale = 'en';

export default new VueI18n({
  locale: fallbackLocale,
  fallbackLocale,
  formatFallbackMessages: true,
  messages: { en },
});
