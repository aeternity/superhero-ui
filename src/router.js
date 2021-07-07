import Router from 'vue-router';
import { IS_MOBILE_DEVICE } from './utils';
import Tracing from './views/admin/Tracing.vue';
import Conference from './views/Conference.vue';
import FAQ from './views/FAQ.vue';
import Governance from './views/Governance.vue';
import Landing from './views/Landing.vue';
import League from './views/League.vue';
import Privacy from './views/Privacy.vue';
import Terms from './views/Terms.vue';
import TipsAndComments from './views/TipsAndComments.vue';
import FeedList from './views/FeedList.vue';
import UserProfile from './views/UserProfile.vue';
import WordBazaar from './views/WordBazaar.vue';
import WordBazaarAssets from './views/WordBazaarAssets.vue';
import WordBazaarCreateToken from './views/WordBazaarCreateToken.vue';
import WordBazaarGetAe from './views/WordBazaarGetAe.vue';
import WordBazaarHowItWorks from './views/WordBazaarHowItWorks.vue';
import WordDetail from './views/WordDetail.vue';
import Trending from './views/Trending.vue';

const routes = [
  {
    path: '/',
    name: 'feed',
    component: FeedList,
    beforeEnter(to, from, next) {
      next(to.fullPath.startsWith('/#/') ? to.fullPath.slice(2) : undefined);
    },
  },
  {
    path: '/search/:query',
    redirect: (to) => ({ name: 'feed', query: { search: to.params.query } }),
  },
  ...process.env.VUE_APP_LANDING_ENABLED ? [{
    path: '/landing',
    name: 'landing',
    component: Landing,
    meta: {
      fullScreen: true,
      layoutClass: 'landing-page',
    },
  }] : [],
  {
    path: '/tip/:tipId/comment/:id',
    name: 'comment',
    component: TipsAndComments,
    props: true,
  },
  {
    path: '/tip/:tipId',
    name: 'tip',
    component: TipsAndComments,
    props: true,
  },
  ...process.env.VUE_APP_WORDBAZAAR_ENABLED ? [{
    path: '/wordbazaar',
    component: WordBazaar,
    children: [{
      path: '',
      name: 'word-bazaar-assets',
      component: WordBazaarAssets,
    }, {
      path: 'create-token',
      name: 'word-bazaar-create-token',
      component: WordBazaarCreateToken,
    }, {
      path: 'get-ae',
      name: 'word-bazaar-get-ae',
      component: WordBazaarGetAe,
    }, {
      path: 'how-it-works',
      name: 'word-bazaar-how-it-works',
      component: WordBazaarHowItWorks,
    }],
  }, {
    path: '/word/:word',
    name: 'word-detail',
    component: WordDetail,
    props: true,
  }] : [],
  {
    path: '/user-profile/:address',
    redirect: '/users/:address',
  },
  {
    path: '/users/:address/:activity?',
    name: 'user-profile',
    component: UserProfile,
    props: true,
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy,
  },
  {
    path: '/league',
    name: 'league',
    component: League,
  },
  {
    path: '/voting',
    name: 'voting',
    component: Governance,
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQ,
  },
  {
    path: '/admin/tracing/:tipId',
    name: 'tracing',
    props: true,
    component: Tracing,
  },
  {
    path: '/meet/:room?',
    name: 'conference',
    component: Conference,
    props: true,
    beforeEnter(to, from, next) {
      if (IS_MOBILE_DEVICE) window.location = `https://${process.env.VUE_APP_JITSI_HOST}/${to.params.room || ''}`;
      else next();
    },
  },
  {
    path: '/trending',
    name: 'trending',
    component: Trending,
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default new Router({ mode: 'history', routes });
