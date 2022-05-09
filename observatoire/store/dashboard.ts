import { MutationTree, ActionTree } from 'vuex'

export const state = () => ({
  period:{
    year:'',
    month:''
  },
  territory:{
    territory:'XXXXX',
    l_territory:'France',
    type:'country',
  },
  activeTab:1
})

export type DashboardState = ReturnType<typeof state>

export const mutations: MutationTree<DashboardState> = {
  GET_PERIOD: (state, period: DashboardState["period"]) => (state.period = period)
}

export const actions: ActionTree<DashboardState, DashboardState> = {
  async getPeriod({ commit }){
    const response = await this.$axios.get('/monthly_flux/last')
    commit('GET_PERIOD',response.data)
  }
}