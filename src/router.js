import Router from 'vue-router';
import { IS_MOBILE_DEVICE } from './utils';
import Tracing from './views/admin/Tracing.vue';
import Conference from './views/Conference.vue';
import CreateProfile from './views/CreateProfile.vue';
import FAQ from './views/FAQ.vue';
import Governance from './views/Governance.vue';
import League from './views/League.vue';
import Maintenance from './views/Maintenance.vue';
import Mission from './views/Mission.vue';
import Privacy from './views/Privacy.vue';
import Terms from './views/Terms.vue';
import TipsAndComments from './views/TipsAndComments.vue';
import TipsList from './views/TipsList.vue';
import TutorialMeet from './views/tutorial/Meet.vue';
import TutorialVoting from './views/tutorial/Voting.vue';
import TutorialWallet from './views/tutorial/Wallet.vue';
import TutorialWidget from './views/tutorial/Widget.vue';
import UserProfile from './views/UserProfile.vue';

export function createRouter() {
    const routes = [
      {
        path: '/',
        name: 'tips',
        component: TipsList,
        meta: { title: 'Tips' },
        beforeEnter(to, from, next) {
          next(to.fullPath.startsWith('/#/') ? to.fullPath.slice(2) : undefined);
        },
      },
      {
        path: '/search/:query',
        name: 'tips-search',
        component: TipsList,
        meta: { title: 'Tips' },
        props: true,
      },
      {
        path: '/tip/:tipId/comment/:id',
        name: 'comment',
        component: TipsAndComments,
        meta: {
          title: 'Comment View',
        },
        props: true,
      },
      {
        path: '/tip/:tipId',
        name: 'tip',
        component: TipsAndComments,
        meta: {
          title: 'Comments for a Tip',
        },
        props: true,
      },
      {
        path: '/user-profile/:address',
        name: 'user-profile',
        component: UserProfile,
        meta: {
          title: 'User Profile',
        },
        props: true,
      },
      {
        path: '/terms',
        name: 'terms',
        component: Terms,
        meta: {
          title: 'Terms of service',
        },
      },
      {
        path: '/privacy',
        name: 'privacy',
        component: Privacy,
        meta: {
          title: 'Privacy policy',
        },
      },
      {
        path: '/tutorial',
        name: 'tutorial',
        component: CreateProfile,
        meta: {
          title: 'Tutorial Page',
        },
      },
      {
        path: '/league',
        name: 'league',
        component: League,
        meta: {
          title: 'Superhero League',
        },
      },
      {
        path: '/voting',
        name: 'voting',
        component: Governance,
        meta: {
          title: 'Superhero Voting',
        },
      },
      {
        path: '/mission',
        name: 'mission',
        component: Mission,
        meta: {
          title: 'Mission Page',
        },
      },
      {
        path: '/tutorial/widget',
        name: 'tutorial-widget',
        component: TutorialWidget,
        meta: {
          title: 'Tutorial Widget Page',
        },
      },
      {
        path: '/tutorial/voting',
        name: 'tutorial-voting',
        component: TutorialVoting,
        meta: {
          title: 'Tutorial Voting Page',
        },
      },
      {
        path: '/tutorial/wallet',
        name: 'tutorial-wallet',
        component: TutorialWallet,
        meta: {
          title: 'Tutorial Wallet Page',
        },
      },
      {
        path: '/tutorial/meet',
        name: 'tutorial-meet',
        component: TutorialMeet,
        meta: {
          title: 'Tutorial Meet Page',
        },
      },
      {
        path: '/faq',
        name: 'faq',
        component: FAQ,
        meta: {
          title: 'FAQ Page',
        },
      },
      {
        path: '/maintenance',
        name: 'maintenance',
        props: true,
        component: Maintenance,
        meta: {
          title: 'Maintenance',
          fullScreen: true,
        },
      },
      {
        path: '/admin/tracing/:tipId',
        name: 'tracing',
        props: true,
        component: Tracing,
        meta: {
          title: 'Tip Tracing',
        },
      },
      {
        path: '/meet/:room?',
        name: 'conference',
        component: Conference,
        props: true,
        meta: {
          title: 'Conference',
        },
        beforeEnter(to, from, next) {
          if (IS_MOBILE_DEVICE) window.location = `https://${process.env.VUE_APP_JITSI_URL}/${to.params.room || ''}`;
          else next();
        },
      },
      {
        path: '*',
        redirect: '/',
      },
    ];

    const router = new Router({ mode: 'history', routes });

    router.beforeEach((to, from, next) => {
      document.title = `${to.meta.title} - Superhero.com`;
      next();
    });

    return router;
}