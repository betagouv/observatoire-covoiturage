<template>
  <div class="fr-container--fluid">
    <client-only>
      <div class="fr-grid-row">
        <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-3 sidebar">
          <Sidebar :period=period :territory=territory @selectedTerritory=emitTerritory />
        </div>
        <div class="fr-col">
          <o-tabs type="toggle" 
            position="centered"
            size="large"
            expanded>
            <o-tab-item label="Chiffres clés" icon="car-key">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-col-lg-8">
                  <Indicators :data=indicators :period=period />
                </div>
                <div class="fr-col-12 fr-col-lg-4">
                  <BestTrips :data=best_trips />
                </div>
              </div>
            </o-tab-item> 
            <o-tab-item label="Cartes" icon="map">
              <div class="fr-grid-row">
                <div class="fr-col">
                  <Aires :data=aires />
                </div>
              </div>
            </o-tab-item>
            <o-tab-item label="Evolution" icon="chart-line"></o-tab-item>
          </o-tabs>
          
        </div>
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'
import Sidebar from '../components/dashboard/key_figures/Sidebar.vue'
import Indicators from '../components/dashboard/key_figures/Indicators.vue'
import BestTrips from '../components/dashboard/key_figures/BestTrips.vue'
import Aires from '../components/dashboard/maps/Aires.vue'
import { MonthlyPeriodInterface, TerritoryInterface } from '../components/interfaces/sidebar'
import { IndicatorsInterface, BestTripsInterface } from '../components/interfaces/keyfigures'

@Component({
  components:{
    Sidebar,
    Indicators,
    BestTrips,
    Aires,
  }
})
export default class Dashboard extends mixins(BreakpointsMixin){

  period:MonthlyPeriodInterface={
    year:'',
    month:''
  }
  territory:TerritoryInterface = {
    territory:'XXXXX',
    l_territory:'France',
    type:'country',
  }
  indicators:IndicatorsInterface | {} = {}
  best_trips:BestTripsInterface | [] = []
  aires = []

  public async mounted(){
    await this.getPeriod()
    this.getIndicators()
    this.getBestTrips()
  }
  
  @Watch('period', { deep: true })
  async onPeriodChanged(val:MonthlyPeriodInterface, oldval:MonthlyPeriodInterface) {
    if (oldval.year !== '' || oldval.month !== ''){
      await this.getIndicators()
    }
  }

  @Watch('territory', { deep: true })
  onTerritoryChanged() {
    this.getIndicators()
    this.getBestTrips()
  }

  public async getPeriod(){
    const response = await this.$axios.get('/monthly_flux/last')
    this.period = response.data
  }

  public async getIndicators(){
    const response = await this.$axios.get(`/indicators?territory=${this.territory.territory}&t=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    response.status === 200 ? this.indicators = response.data[0] : this.indicators = {}
  }
  public async getBestTrips(){
    const response = await this.$axios.get(`/best_journeys?territory=${this.territory.territory}&t=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    this.best_trips = response.data
  }

  public emitTerritory(value:TerritoryInterface){
    this.territory = value
  }
}
</script>