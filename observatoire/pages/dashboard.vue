<template>
  <div class="fr-container--fluid">
    <client-only>
      <div class="fr-grid-row content">
        <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-3 sidebar">
          <Sidebar :period=period :territory=territory @selectedTerritory=emitTerritory />
        </div>
        <div class="fr-col-12 fr-col-lg-9">
          <Indicators :data.sync=data :time=period />
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


@Component({
  components:{Sidebar, Indicators}
})
export default class Dashboard extends mixins(BreakpointsMixin){

  period:MonthlyPeriodInterface={
    year:'',
    month:''
  }
  type='country'
  territory='XXXXX'
  data = {}
  best_journeys = []

  public async mounted(){
    await this.getPeriod()
    await this.getData()
  }
  
  @Watch('period', { deep: true })
  async onPeriodChanged(val:MonthlyPeriodInterface, oldval:MonthlyPeriodInterface) {
    if (oldval.year !== '' || oldval.month !== ''){
      await this.getData()
    }
  }

  @Watch('territory')
  onTerritoryChanged() {
    this.getData()
  }

  public async getPeriod(){
    const response = await this.$axios.get('/monthly_flux/last')
    this.period = response.data
  }

  public async getData(){
    const response = await this.$axios.get('/indicators?territory='+this.territory+'&t='+this.type+'&year='+this.period.year+'&month='+this.period.month)
    response.status === 200 ? this.data = response.data[0] : this.data = {}
  }
  public async getBestJourneys(){
    const response = await this.$axios.get('/best_journeys?territory='+this.territory+'&t='+this.type+'&year='+this.period.year+'&month='+this.period.month)
    this.best_journeys = response.data
  }

  public emitTerritory(value:string){
    this.territory = value
  }
}
</script>