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
  densitePeriod:{
    start:new Date,
    end:new Date,
  },
  selectedFluxType:'com',
  maxFluxNb:0,
  selectedFluxNb: [0,0],
  selectedVoie:'',
})

export type DashboardState = ReturnType<typeof state>

export const mutations: MutationTree<DashboardState> = {
  YEAR: (state, year: string) => (state.period.year = year),
  MONTH: (state, month: string) => (state.period.month = month),
  PERIOD: (state, period: DashboardState["period"]) => (state.period = period),
  TERRITORY: (state, territory: DashboardState["territory"]) => (state.territory = territory),
  ACTIVETAB: (state, activeTab: DashboardState["activeTab"]) => (state.activeTab = activeTab),
  ACTIVEMAP: (state, activeMap: DashboardState["activeMap"]) => (state.activeMap = activeMap),
  DENSITE_PERIOD: (state, densitePeriod: DashboardState["densitePeriod"]) => (state.densitePeriod = densitePeriod),
  SELECTED_FLUX_TYPE: (state, selectedFluxType: DashboardState["selectedFluxType"]) => (state.selectedFluxType = selectedFluxType),
  MAX_FLUX_NB: (state, maxFluxNb: DashboardState["maxFluxNb"]) => (state.maxFluxNb = maxFluxNb),
  SELECTED_FLUX_NB: (state, selectedFluxNb: DashboardState["selectedFluxNb"]) => (state.selectedFluxNb = selectedFluxNb),
  SELECTED_VOIE: (state, selectedVoie: DashboardState["selectedVoie"]) => (state.selectedVoie = selectedVoie),
}

export const actions: ActionTree<DashboardState, DashboardState> = {
  async getPeriod({ commit }){
    const response = await this.$axios.get('/monthly_flux/last')
    commit('PERIOD',response.data)
  },
  async getDensitePeriod({ commit }){
    const response = await this.$axios.get('/rpc/last')
    const period = { 
      start: new Date(new Date(response.data.date).setMonth(new Date(response.data.date).getMonth() - 1)),
      end: new Date(response.data.date)
    }
    commit('DENSITEPERIOD',period)
  }
}