<template>
  <div class="graph">
    <div class="fr-tile">
      <div class="fr-tile__body">
        <line-chart
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
import { EvolInterface } from '../../interfaces/graphs'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Journeys extends Vue{
  dashboard!: DashboardState  
  data:EvolInterface[] | [] = []

  chartOptions = {
    responsive: true,
    elements: {
      line: {
        fill: true
      }
    }
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:[],
      datasets:[]
    }
    const labels = this.data.map((d:EvolInterface) =>{ 
      const month = this.monthList.find(m => m.id == d.month)
      return month.name + ' '+ d.year
    })
    const journeys = this.data.map(d => d.journeys)
    const incentive = this.data.map(d => d.has_incentive)
    chart.labels = labels.reverse() 
    chart.datasets.push({
      label:'Nombre de trajets',
      data:journeys.reverse(),
      borderColor:'#000091',
      backgroundColor:'rgba(0, 0, 145, 0.2)',
      tension: 0.1,
      order:2
    },
    {
      label:'Nombre de trajets incités',
      data:incentive.reverse(),
      borderColor:'#A19237',
      backgroundColor:'rgba(161, 146, 55, 0.6)',
      tension: 0.1,
      order:1
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
    const response = await this.$axios.get(`/evolution/monthly?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
    this.data = response.data
  }
}
</script>
<style lang="scss">
  .graph{
    padding:10px;
  }
</style>