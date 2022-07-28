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
  densiteZoom:8,
  selectedFluxType:'com',
  maxFluxNb:0,
  selectedFluxNb: [0,0],
  selectedOccupationType:'com',
  selectedVoie:'',
  airesSwitch:[
    {name:'Supermarché', active:true},
    {name:'Parking', active:true},
    {name:'Aire de covoiturage', active:true},
    {name:'Délaissé routier', active:true},
    {name:'Auto-stop', active:true},
    {name:'Parking relais', active:true},
    {name:'Sortie d\'autoroute', active:true},
    {name:'Autres',active:true},
  ]
})

export type DashboardState = ReturnType<typeof state>

export const mutations: MutationTree<DashboardState> = {
  YEAR: (state, year: string) => (state.period.year = year),
  MONTH: (state, month: string) => (state.period.month = month),
  PERIOD: (state, period: DashboardState["period"]) => (state.period = period),
  TERRITORY: (state, territory: DashboardState["territory"]) => (state.territory = territory),
  ACTIVETAB: (state, activeTab: DashboardState["activeTab"]) => (state.activeTab = activeTab),
  ACTIVEMAP: (state, activeMap: DashboardState["activeMap"]) => (state.activeMap = activeMap),
  DENSITE_PERIOD_START: (state, densitePeriodStart: Date) => (state.densitePeriod.start = densitePeriodStart),
  DENSITE_PERIOD_END: (state, densitePeriodEnd: Date) => (state.densitePeriod.end = densitePeriodEnd),
  DENSITE_ZOOM: (state, densiteZoom: DashboardState["densiteZoom"]) => (state.densiteZoom = densiteZoom),
  SELECTED_FLUX_TYPE: (state, selectedFluxType: DashboardState["selectedFluxType"]) => (state.selectedFluxType = selectedFluxType),
  MAX_FLUX_NB: (state, maxFluxNb: DashboardState["maxFluxNb"]) => (state.maxFluxNb = maxFluxNb),
  SELECTED_FLUX_NB: (state, selectedFluxNb: DashboardState["selectedFluxNb"]) => (state.selectedFluxNb = selectedFluxNb),
  SELECTED_OCCUPATION_TYPE: (state, selectedOccupationType: DashboardState["selectedOccupationType"]) => (state.selectedOccupationType = selectedOccupationType),
  SELECTED_VOIE: (state, selectedVoie: DashboardState["selectedVoie"]) => (state.selectedVoie = selectedVoie),
  AIRES_SWITCH:(state, aireSwitch: DashboardState["airesSwitch"][0]) => (state.airesSwitch = [...state.airesSwitch.map(item => item.name !== aireSwitch.name ? item : {...item, ...aireSwitch})])
}

export const actions: ActionTree<DashboardState, DashboardState> = {
  async getPeriod({ commit }){
    const response = await this.$axios.get('/monthly_flux/last')
    commit('PERIOD',response.data)
  },
  async getDensitePeriod({ commit }){
    const response = await this.$axios.get('/rpc/last')
    const period = { 
      start: new Date(new Date(response.data.date).getFullYear(),new Date(response.data.date).getMonth() - 1,1),
      end: new Date(new Date(response.data.date).getFullYear(),new Date(response.data.date).getMonth(),0)
    }
    commit('DENSITE_PERIOD_START',period.start)
    commit('DENSITE_PERIOD_END',period.end)
  },
}