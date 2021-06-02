import VueRouter from 'vue-router'
import Flux from '../components/pages/Flux'
import Aires from '../components/pages/Aires'
import Occupation from '../components/pages/Occupation'


let router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Flux', component: Flux },
    { path: '/aires-covoiturage', name: 'Aires', component: Aires },
    { path: '/occupation', name: 'Occupation', component: Occupation },
    { path: '*', redirect: '/' }
  ]
})

export default router
