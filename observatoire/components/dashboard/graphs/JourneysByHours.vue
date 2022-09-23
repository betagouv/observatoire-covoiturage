<template>
  <div class="graph">
    <div class="fr-tile">
      <div class="fr-tile__body">
        <o-loading :active.sync="isLoading">
          <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
        </o-loading>
        <bar-chart
          :chart-data="chartData"
          :height=150
          :chart-options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { JourneysByHoursInterface } from '../../interfaces/graphs'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class JourneysByHours extends Vue{
  dashboard!: DashboardState  
  data:JourneysByHoursInterface[] | [] = []

  isLoading = false
  chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
            return value + ' h';
          }
        }
      }
    },
    parsing: {
      xAxisKey: 'hour',
      yAxisKey: 'journeys'
    }    
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      datasets:[],
    }
    chart.datasets.push({
      label:'Répartition des trajets par tranche horaire',
      data:this.data,
      borderColor:'#000091',
      backgroundColor:'rgba(0, 0, 145, 0.2)',
      tension: 0.1,
    })
    return chart
  }

  public mounted(){
    this.getData()
  }

  @Watch('dashboard.period', { deep: true })
  onPeriodChanged() {
    this.getData()
  }
  
  @Watch('dashboard.territory', { deep: true })
  onTerritoryChanged() {
    this.getData()
  }

  public async getData(){
    this.isLoading = true
    const response = await this.$axios.get(`/journeys_by_hours?territory=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
    this.data = response.data
    this.isLoading = false
  }
}
</script>
<style lang="scss">
  .graph{
    padding:10px;
  }
</style>