import Router from 'vue-router'
import TipsList from "./views/TipsList";
import TipCommentsView from "./views/TipCommentsView";

let guardTipComments = (to, from, next) => {
  if(to.name == 'tip' && to.params.tipId){
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
    path: '/tip/:tipId',
    name: 'tip',
    component: TipCommentsView,
    meta: {
      title: 'Comments for a Tip'
    },
    props: true,
    beforeEnter : guardTipComments,
  }
]

const router = new Router({mode: 'history', routes: routes})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Tipping Aggregator`
  next()
})

export default router;
