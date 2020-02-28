import Router from 'vue-router'
import TipsList from "./views/TipsList";
import TipCommentsView from "./views/TipCommentsView";
import UserProfileView from "./views/UserProfileView";

let guardTipComments = (to, from, next) => {
  if(to.name == 'tip' && typeof to.params.id !== "undefined"){
    next();
  }else{
    next('/');
  }
}


const routes = [
  {
    path: '/',
    name: 'home',
    component: TipsList,
    meta: {title: 'Home'}
  },{
    path: '/tip/:id',
    name: 'tip',
    component: TipCommentsView,
    meta: {
      title: 'Comments for a Tip'
    },
    props: true,
    beforeEnter : guardTipComments,
  },{
    path: '/user-profile/:address',
    name: 'user-profile',
    component: UserProfileView,
    meta: {title: 'User Profile'},
    props: true
  }
]

const router = new Router({mode: 'history', routes: routes})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Tipping Aggregator`
  next()
})

export default router;
