import Vue from 'vue'
import Vuex from 'vuex'
import screen from './screen'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    screen,
  }
})
