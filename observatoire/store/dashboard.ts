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
  activeTab:1,
  activeMap :'flux',
})

export type DashboardState = ReturnType<typeof state>

export const mutations: MutationTree<DashboardState> = {
  YEAR: (state, year: string) => (state.period.year = year),
  MONTH: (state, month: string) => (state.period.month = month),
  PERIOD: (state, period: DashboardState["period"]) => (state.period = period),
  TERRITORY: (state, territory: DashboardState["territory"]) => (state.territory = territory),
  ACTIVETAB: (state, activeTab: DashboardState["activeTab"]) => (state.activeTab = activeTab),
  ACTIVEMAP: (state, activeMap: DashboardState["activeMap"]) => (state.activeMap = activeMap),
}

export const actions: ActionTree<DashboardState, DashboardState> = {
  async getPeriod({ commit }){
    const response = await this.$axios.get('/monthly_flux/last')
    commit('PERIOD',response.data)
  }
}