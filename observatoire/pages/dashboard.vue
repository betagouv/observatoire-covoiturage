<template>
  <div class="fr-container--fluid">
    <client-only>
      <div class="fr-grid-row">
        <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-3 sidebar">
          <Sidebar v-if="dashboard.period" :period=dashboard.period :territory=territory @selectedTerritory=emitTerritory />
        </div>
        <div class="fr-col">
          <o-tabs 
            v-model="activeTab"
            type="toggle" 
            position="centered"
            size="normal"
            expanded>
            <o-tab-item label="Chiffres clés" icon="car-key">
              <KeyFiguresIndex />
            </o-tab-item> 
            <o-tab-item label="Cartes" icon="map">
              <MapIndex v-if="activeTab===2" activeMap='occupation' :period=dashboard.period :territory=territory /> 
            </o-tab-item>
            <o-tab-item label="Evolution" icon="chart-line"></o-tab-item>
          </o-tabs>
          
        </div>
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'
import Sidebar from '../components/dashboard/key_figures/Sidebar.vue'
import KeyFiguresIndex from '../components/dashboard/key_figures/Index.vue'
import MapIndex from '../components/dashboard/maps/Index.vue'
import { MonthlyPeriodInterface, TerritoryInterface } from '../components/interfaces/sidebar'
import { mapState } from 'vuex'

@Component({
  components:{
    Sidebar,
    KeyFiguresIndex,
    MapIndex,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Dashboard extends mixins(BreakpointsMixin){

  period:MonthlyPeriodInterface | null = null
  territory:TerritoryInterface = {
    territory:'XXXXX',
    l_territory:'France',
    type:'country',
  }
  activeTab=1


  public async created(){
    await this.$store.dispatch('dashboard/getPeriod')
  }

  public emitTerritory(value:TerritoryInterface){
    this.territory = value
  }
}
</script>