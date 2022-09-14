<template>
  <nav class="fr-sidemenu" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <div class="sidebar-title">
        <SidebarSelectTerritory v-if="dashboard.period.year !== ''" />
        <SidebarMonthlyPeriod />
      </div>
      <div class="select-map" v-if="dashboard.activeTab === 2">
        <SidebarSelectMap />
      </div>
      <div class="select-graph" v-if="dashboard.activeTab === 3">
        <SidebarSelectGraph />
      </div>
      <div v-if="!lgAndAbove && dashboard.activeTab !== 1">
        <o-field>
          <o-switch size="small" variant="warning" v-model="legend">
          Afficher la légende
          </o-switch>
          <button v-if="!screen.isSidebarOpen" class="fr-btn fr-btn--primary filter" @click="openSidebar">
            + de filtres
          </button>
          <button v-else class="fr-btn fr-btn--primary filter" @click="openSidebar">
            Fermer les filtres
          </button>
        </o-field>
      </div>
      <div v-if="lgAndAbove || screen.isSidebarOpen" class="filters">
        <SidebarMapControlsSelectVoiesReservees v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'voies' "/>
        <SidebarMapControlsSelectFluxType v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'flux' "/>     
        <SidebarMapControlBetweenFluxNb v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'flux' "/>
        <SidebarMapControlDatepickerDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/>
        <SidebarMapControlZoomDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/> 
        <SidebarMapControlLayersDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/> 
        <SidebarMapControlsSelectOccupationType v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'occupation' "/>
        <SidebarMapControlsAiresSwitch v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'aires' "/> 
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarMonthlyPeriod from './MonthlyPeriod.vue'
import SidebarSelectTerritory from './SelectTerritory.vue'
import SidebarSelectMap from './SelectMap.vue'
import SidebarSelectGraph from './SelectGraph.vue'
import SidebarMapControlsSelectVoiesReservees from './mapControls/SelectVoiesReservees.vue'
import SidebarMapControlsSelectFluxType from './mapControls/SelectFluxType.vue'
import SidebarMapControlBetweenFluxNb from './mapControls/BetweenFluxNb.vue'
import SidebarMapControlDatepickerDensite from './mapControls/DatepickerDensite.vue'
import SidebarMapControlZoomDensite from './mapControls/ZoomDensite.vue'
import SidebarMapControlLayersDensite from './mapControls/LayersDensite.vue'
import SidebarMapControlsSelectOccupationType from './mapControls/SelectOccupationType.vue'
import SidebarMapControlsAiresSwitch from './mapControls/AiresSwitch.vue'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'


@Component({
  components:{
    SidebarMonthlyPeriod,
    SidebarSelectTerritory,
    SidebarSelectMap,
    SidebarSelectGraph,
    SidebarMapControlsSelectVoiesReservees,
    SidebarMapControlsSelectFluxType,
    SidebarMapControlBetweenFluxNb,
    SidebarMapControlDatepickerDensite,
    SidebarMapControlZoomDensite,
    SidebarMapControlLayersDensite,
    SidebarMapControlsSelectOccupationType,
    SidebarMapControlsAiresSwitch,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class KeySidebar extends mixins(BreakpointsMixin){
  dashboard!: DashboardState 
  get legend(){
    return this.$store.state.screen.isLegendOpen
  } 
  set legend(value){
    this.openLegend()
  }
}
</script>