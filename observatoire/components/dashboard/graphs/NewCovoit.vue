<template>
  <div class="graph">
    <div class="fr-tile">
      <div class="fr-tile__body">
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
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class NewDrivers extends Vue{
  dashboard!: DashboardState  
  data: [string ,number, number, number][] = []
  filterData: [string ,number, number, number][] = []

  chartOptions = {
    responsive: true,  
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:[],
      datasets:[],
    }
    const labels = this.filterData.map((d) =>{ 
      const month = this.monthList.find(m => m.id == parseInt(d[0].split('-')[1]))
      return month.name + ' '+ d[0].split('-')[0]
    })
    
    chart.labels = labels
    chart.datasets.push({
      label:'Nombre de nouveaux conducteurs',
      data:this.filterData.map(d => d[1]),
      borderColor:'#000091',
      backgroundColor:'rgba(0, 0, 145, 0.2)',
      tension: 0.1,
    })
    chart.datasets.push({
      label:'Nombre de nouveaux passagers',
      data:this.filterData.map(d => d[2]),
      borderColor:'#A19237',
      backgroundColor:'rgba(161, 146, 55, 0.6)',
      tension: 0.1,
    })
    return chart
  }

  public async mounted(){
    await this.getData()
    this.chunkData()
  }

  @Watch('dashboard.period', { deep: true })
  onPeriodChanged() {
    this.chunkData()
  }
  
  public async getData(){
    const response = await this.$axios.get(`/stats/public/card/41d3a65c-4f98-4f4e-b1b6-9bf1a46ffbc1/query`)
    this.data = response.data.data.rows
  }

  public chunkData(){
    const selectedPeriod = `${this.dashboard.period.year}-${String(this.dashboard.period.month).padStart(2, '0')}`
    const index = this.data.findIndex( d => d[0] == selectedPeriod)
    const data = this.data.slice(index-12 > 0 ?index-12 : 0, index < 0 ? this.data.length : index+1)
    this.filterData = data
  }
}
</script>
<style lang="scss">
  .graph{
    padding:10px;
  }
</style>
