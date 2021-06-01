import Router from 'vue-router';
import { IS_MOBILE_DEVICE } from './utils';
import Tracing from './views/admin/Tracing.vue';
import Conference from './views/Conference.vue';
import CreateProfile from './views/CreateProfile.vue';
import FAQ from './views/FAQ.vue';
import Governance from './views/Governance.vue';
import Landing from './views/Landing.vue';
import League from './views/League.vue';
import Maintenance from './views/Maintenance.vue';
import Mission from './views/Mission.vue';
import Privacy from './views/Privacy.vue';
import Terms from './views/Terms.vue';
import TipsAndComments from './views/TipsAndComments.vue';
import FeedList from './views/FeedList.vue';
import TutorialMeet from './views/tutorial/Meet.vue';
import TutorialVoting from './views/tutorial/Voting.vue';
import TutorialWallet from './views/tutorial/Wallet.vue';
import TutorialWidget from './views/tutorial/Widget.vue';
import UserProfile from './views/UserProfile.vue';
import WordBazaar from './views/WordBazaar.vue';
import WordBazaarAssets from './views/WordBazaarAssets.vue';
import WordBazaarCreateToken from './views/WordBazaarCreateToken.vue';
import WordBazaarGetAe from './views/WordBazaarGetAe.vue';
import WordBazaarHowItWorks from './views/WordBazaarHowItWorks.vue';
import WordDetail from './views/WordDetail.vue';

const routes = [
  {
    path: '/',
    name: 'feed',
    component: FeedList,
    beforeEnter(to, from, next) {
      next(to.fullPath.startsWith('/#/') ? to.fullPath.slice(2) : undefined);
    },
  },
  ...process.env.LANDING_ENABLED ? [{
    path: '/landing',
    name: 'landing',
    component: Landing,
    meta: {
      fullScreen: true,
      layoutClass: 'landing-page',
    },
  }] : [],
  {
    path: '/search/:query',
    name: 'feed-search',
    component: FeedList,
    props: true,
  },
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
    path: '/users/:address',
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
    path: '/tutorial',
    name: 'tutorial',
    component: CreateProfile,
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
    path: '/mission',
    name: 'mission',
    component: Mission,
  },
  {
    path: '/tutorial/widget',
    name: 'tutorial-widget',
    component: TutorialWidget,
  },
  {
    path: '/tutorial/voting',
    name: 'tutorial-voting',
    component: TutorialVoting,
  },
  {
    path: '/tutorial/wallet',
    name: 'tutorial-wallet',
    component: TutorialWallet,
  },
  {
    path: '/tutorial/meet',
    name: 'tutorial-meet',
    component: TutorialMeet,
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQ,
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    props: true,
    component: Maintenance,
    meta: {
      fullScreen: true,
    },
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
    path: '*',
    redirect: '/',
  },
];

export default new Router({ mode: 'history', routes });
