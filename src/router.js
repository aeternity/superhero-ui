import Router from 'vue-router';
import CreateProfile from './views/CreateProfile.vue';
import FAQ from './views/FAQ.vue';
import Maintenance from './views/Maintenance.vue';
import SingleCommentView from './views/SingleCommentView.vue';
import Mission from './views/Mission.vue';
import Privacy from './views/Privacy.vue';
import Terms from './views/Terms.vue';
import TipCommentsView from './views/TipCommentsView.vue';
import TipsList from './views/TipsList.vue';
import UserProfileView from './views/UserProfileView.vue';

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
  },
  {
    path: '/tip/:tipId/comment/:id',
    name: 'comment',
    component: SingleCommentView,
    meta: {
      title: 'Comment View',
    },
    props: true,
    beforeEnter: guardCommentView,
  },
  {
    path: '/tip/:id',
    name: 'tip',
    component: TipCommentsView,
    meta: {
      title: 'Comments for a Tip',
    },
    props: true,
    beforeEnter: guardTipComments,
  },
  {
    path: '/user-profile/:address',
    name: 'user-profile',
    component: UserProfileView,
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
];

const router = new Router({ mode: 'hash', routes });

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Superhero.com`;
  window.scrollTo(0, 0);
  next();
});

export default router;
