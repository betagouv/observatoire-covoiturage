import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import dsfrModule from '@gouvfr/dsfr/dist/js/dsfr.module.min'
import dsfrNomodule from '@gouvfr/dsfr/dist/js/dsfr.nomodule.min';


Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(dsfrModule)
Vue.use(dsfrNomodule)


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
