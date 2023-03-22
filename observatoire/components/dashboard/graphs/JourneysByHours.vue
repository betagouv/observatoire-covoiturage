<template>
  <div class="graph">
    <div class="fr-card fr-card--no-border">
      <div class="fr-card__body">
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
import { mapState } from 'vuex'
import { JourneysByHoursInterface } from '../../interfaces/graphs'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class JourneysByHours extends Vue {
  dashboard!: DashboardState
  data:JourneysByHoursInterface[] | [] = []
  def_url = '/pages/glossaire/#trajet'

  isLoading = false
  chartOptions = {
    responsive: true,
    skipNull: true,
    plugins:{
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value, index, ticks) {
            return value + 'h';
          }
        }
      }
    },
    parsing: {
      xAxisKey: 'hour',
      yAxisKey: 'journeys'
    }
  }

  get dataWithNull(){
    const arrayA = [...this.data]
    const arrayB:number[] = Array.from({length:24}, (v, k) => k);
    const lookupA = arrayA.reduce((acc, curr) => ({ ...acc, [curr.hour]: curr }), {});
    const result = arrayB.map((hour) => lookupA[hour] ?? { hour, journeys: 0 });
    return result
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:['0h','1h','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h'],
      datasets:[],
    }
    chart.datasets.push({
      data:this.dataWithNull,
      borderColor:'#000091',
      backgroundColor:'rgba(0, 0, 145, 0.2)',
      tension: 0.1,
      datalabels: {
        labels: {
          title: null
        }
      }
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