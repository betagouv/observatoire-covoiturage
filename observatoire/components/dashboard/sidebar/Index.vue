<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <SidebarTitle :title=title />
      <SidebarSelectMap v-if="dashboard.activeTab === 2" />
      <SidebarMonthlyPeriod />
      <SidebarSelectTerritory v-if="dashboard.period.year !== ''" />
      
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarTitle from './Title.vue'
import SidebarMonthlyPeriod from './MonthlyPeriod.vue'
import SidebarSelectTerritory from './SelectTerritory.vue'
import SidebarSelectMap from './SelectMap.vue'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'


@Component({
  components:{
    SidebarTitle,
    SidebarMonthlyPeriod,
    SidebarSelectTerritory,
    SidebarSelectMap,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class KeySidebar extends mixins(BreakpointsMixin){
  dashboard!: DashboardState 
  
  get title(){
    let title = 'Situation nationale mensuelle'
    if (this.dashboard.territory && this.dashboard.territory.type !== 'country' ){
      title = 'Situation locale mensuelle'
    }
    return title
  }
}
</script>