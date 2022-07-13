<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <div class="sidebar-title">
        <SidebarSelectTerritory v-if="dashboard.period.year !== ''" />
        <SidebarMonthlyPeriod />
      </div>
      <SidebarSelectMap v-if="dashboard.activeTab === 2" />      
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarMonthlyPeriod from './MonthlyPeriod.vue'
import SidebarSelectTerritory from './SelectTerritory.vue'
import SidebarSelectMap from './SelectMap.vue'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'


@Component({
  components:{
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
<style lang="scss">
 .sidebar-title{
   background-color: #000091;
   padding: 20px 5px;
   h3 {
     color: #ffffff;
     text-align: center;
   }
 }
</style>