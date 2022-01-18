import { MutationTree,ActionTree } from 'vuex'
import env from 'static/js/env'

const getEnv = () =>
  process.server
    ? env || {}
    : {}

export const state = () => ({
  env: {}
})

export type EnvState = ReturnType<typeof state>

export const mutations: MutationTree<EnvState> = {
  setEnv (state, content) {
    state.env = content
  }
}

export const actions:ActionTree<EnvState,EnvState> = {
  nuxtServerInit({ commit }) {
    commit('setEnv', getEnv())
  }
}