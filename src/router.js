import Router from 'vue-router';
import TipsList from './views/TipsList';
import TipCommentsView from './views/TipCommentsView';
import UserProfileView from './views/UserProfileView';
import Terms from './views/Terms';
import Privacy from './views/Privacy';
import Mission from './views/Mission';
import CreateProfile from './views/CreateProfile';

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
    path: '/mission',
    name: 'mission',
    component: Mission,
    meta: {
      title: 'Mission',
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
];

const router = new Router({ mode: 'hash', routes });

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Superhero.com`;
  next();
});

export default router;
