<template>
  <div class="fr-container--fluid">
    <client-only>
      <div class="fr-grid-row">
        <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-3 sidebar">
          <Sidebar v-if="period" :period=period :territory=territory @selectedTerritory=emitTerritory />
        </div>
        <div class="fr-col">
          <o-tabs 
            v-model="activeTab"
            type="toggle" 
            position="centered"
            size="normal"
            expanded>
            <o-tab-item label="Chiffres clés" icon="car-key">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-col-lg-8">
                  <Indicators v-if="period" :period=period :territory=territory />
                </div>
                <div class="fr-col-12 fr-col-lg-4">
                  <BestTrips v-if="period" :period=period :territory=territory />
                </div>
              </div>
            </o-tab-item> 
            <o-tab-item label="Cartes" icon="map">
              
              <Aires v-if="activeTab===2" :period=period :territory=territory />
                
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
import Indicators from '../components/dashboard/key_figures/Indicators.vue'
import BestTrips from '../components/dashboard/key_figures/BestTrips.vue'
import Aires from '../components/dashboard/maps/Aires.vue'
import { MonthlyPeriodInterface, TerritoryInterface } from '../components/interfaces/sidebar'

@Component({
  components:{
    Sidebar,
    Indicators,
    BestTrips,
    Aires,
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
    await this.getPeriod()
  }

  public async getPeriod(){
    const response = await this.$axios.get('/monthly_flux/last')
    this.period = response.data
  }

  public emitTerritory(value:TerritoryInterface){
    this.territory = value
  }
}
</script>