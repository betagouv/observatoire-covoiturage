import VueRouter from 'vue-router'
import Flux from '../components/pages/Flux'
import Aires from '../components/pages/Aires'


let router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Flux', component: Flux },
    { path: '/aires-covoiturage', name: 'Aires', component: Aires },
    { path: '*', redirect: '/' }
  ]
})

export default router
