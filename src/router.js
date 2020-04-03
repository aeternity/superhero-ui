import Router from 'vue-router';
import TipsList from './views/TipsList.vue';
import TipCommentsView from './views/TipCommentsView.vue';
import UserProfileView from './views/UserProfileView.vue';
import Terms from './views/Terms.vue';
import Privacy from './views/Privacy.vue';
import FAQ from './views/FAQ.vue';
import Maintenance from './views/Maintenance.vue';
import Mission from './views/Mission.vue';
import CreateProfile from './views/CreateProfile.vue';

const guardTipComments = (to, from, next) => {
  if (to.name === 'tip' && typeof to.params.id !== 'undefined') {
    next();
  } else {
    next('/');
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: TipsList,
    meta: { title: 'Home' },
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
    path: '/create-profile',
    name: 'create-profile',
    component: CreateProfile,
    meta: {
      title: 'Create Profile',
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
    path: '/mission',
    name: 'mission',
    component: Mission,
    meta: {
      title: 'Mission Page',
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
