<template>
  <nav class="fr-sidemenu--sticky" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <o-field>
        <button v-if="!lgAndAbove" class="fr-link--close fr-link" title="Menu" @click="openSidebar">
          Fermer
        </button>
      </o-field>
      <div class="sidebar-title">
        <SidebarSelectTerritory v-if="dashboard.period.year !== ''" />
        <SidebarMonthlyPeriod />
      </div>
      <SidebarSelectMap v-if="dashboard.activeTab === 2" /> 
      <SidebarMapControlsSelectVoiesReservees v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'voies' "/>
      <SidebarMapControlsSelectFluxType v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'flux' "/>     
      <SidebarMapControlBetweenFluxNb v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'flux' "/>
      <SidebarMapControlDatepickerDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/>
      <SidebarMapControlZoomDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/> 
      <SidebarMapControlLayersDensite v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'densite' "/> 
      <SidebarMapControlsSelectOccupationType v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'occupation' "/>
      <SidebarMapControlsAiresSwitch v-if="dashboard.activeTab === 2 && dashboard.activeMap === 'aires' "/>    
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarMonthlyPeriod from './MonthlyPeriod.vue'
import SidebarSelectTerritory from './SelectTerritory.vue'
import SidebarSelectMap from './SelectMap.vue'
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
}
</script>