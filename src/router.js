import Router from 'vue-router';
import CreateProfile from './views/CreateProfile.vue';
import FAQ from './views/FAQ.vue';
import Maintenance from './views/Maintenance.vue';
import SingleComment from './views/SingleComment.vue';
import League from './views/League.vue';
import Mission from './views/Mission.vue';
import Privacy from './views/Privacy.vue';
import Terms from './views/Terms.vue';
import TipComments from './views/TipComments.vue';
import TipsList from './views/TipsList.vue';
import UserProfile from './views/UserProfile.vue';
import Tracing from './views/admin/Tracing.vue';
import Networking from './views/Networking.vue';

const guardTipComments = (to, from, next) => {
  if (to.name === 'tip' && typeof to.params.id !== 'undefined') {
    next();
  } else {
    next('/');
  }
};

const guardCommentView = (to, from, next) => {
  if (to.name === 'comment'
      && typeof to.params.id !== 'undefined'
      && typeof to.params.tipId !== 'undefined') {
    next();
  } else {
    next('/');
  }
};

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
    path: '/tip/:tipId/comment/:id',
    name: 'comment',
    component: SingleComment,
    meta: {
      title: 'Comment View',
    },
    props: true,
    beforeEnter: guardCommentView,
  },
  {
    path: '/tip/:id',
    name: 'tip',
    component: TipComments,
    meta: {
      title: 'Comments for a Tip',
    },
    props: true,
    beforeEnter: guardTipComments,
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
    path: '/mission',
    name: 'mission',
    component: Mission,
    meta: {
      title: 'Mission Page',
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
    },
  },
  {
    path: '/admin/tracing/:id',
    name: 'tracing',
    props: true,
    component: Tracing,
    meta: {
      title: 'Tip Tracing',
    },
  },
  {
    path: '/networking',
    name: 'networking',
    component: Networking,
    meta: {
      title: 'Networking',
    },
  },
];

const router = new Router({ mode: 'history', routes });

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Superhero.com`;
  window.scrollTo(0, 0);
  next();
});

export default router;
