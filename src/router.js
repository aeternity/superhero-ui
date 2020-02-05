import Router from 'vue-router'
import TipsList from "./views/TipsList";

const routes = [
  {
    path: '/',
    name: 'home',
    component: TipsList,
    meta: {title: 'Home'}
  }
]

const router = new Router({mode: 'hash', routes: routes})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Tipping Aggregator`
  next()
})

export default router;
