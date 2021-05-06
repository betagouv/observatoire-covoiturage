import VueRouter from 'vue-router'
import Home from '../components/pages/Home'


let router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '*', redirect: '/' }
  ]
})

export default router
