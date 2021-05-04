import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import stores from './stores'
import Buefy from 'buefy'


Vue.use(Buefy)

Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router,
  stores,
}).$mount('#app')
