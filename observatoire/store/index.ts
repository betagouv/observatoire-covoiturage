import { MutationTree,ActionTree } from 'vuex'

export const state = () => ({
  env: {
    url_api: null,
    url_app: null,
  }
})

export type EnvState = ReturnType<typeof state>

export const mutations: MutationTree<EnvState> = {
  setUrlApi(state, value) {
    state.env.url_api = value
  },
  setUrlApp(state, value) {
    state.env.url_app = value
  }
}

export const actions:ActionTree<EnvState,EnvState> = {
  nuxtServerInit({ commit }) {
    commit('setUrlApi', process.env.URL_API || 'http://localhost:8080/v1')
    commit('setUrlApp', process.env.URL_APP || 'http://localhost:3000')
  }
}