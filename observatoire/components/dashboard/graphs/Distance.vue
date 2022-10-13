<template>
  <div class="graph">
    <div class="fr-card fr-card--no-border">
      <div class="fr-card__body">
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
export default class Distance extends Vue{
  dashboard!: DashboardState  
  data:EvolInterface[] | [] = []
  def_url = "/pages/glossaire/#distance_moyenne"

  chartOptions = {
    responsive: true,
    elements: {
      line: {
        fill: true
      }
    },
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
            return value + ' km';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.parsed.y + ' km';
          }
        }
      }
    }
    
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:[],
      datasets:[],
    }
    const labels = this.data.map((d:EvolInterface) =>{ 
      const month = this.monthList.find(m => m.id == d.month)
      return month.name + ' '+ d.year
    })
    const distance = this.data.map(d => (d.distance/d.passengers).toFixed(2))
    chart.labels = labels.reverse() 
    chart.datasets.push({
      label:'Distance moyenne des trajets (en km)',
      data:distance.reverse(),
      borderColor:'#000091',
      backgroundColor:'rgba(0, 0, 145, 0.2)',
      tension: 0.1,
    })
    return chart
  }

  public mounted(){
    this.getData()
    this.$store.commit('dashboard/REF_GLOSSARY', this.def_url)
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