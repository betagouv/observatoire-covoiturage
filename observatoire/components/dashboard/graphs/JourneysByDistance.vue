<template>
  <div class="graph">
    <div class="fr-card fr-card--no-border">
      <div class="fr-card__body">
        <o-loading :active.sync="isLoading">
          <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
        </o-loading>
        <doughnut-chart
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
import { JourneysByDistanceInterface } from '../../interfaces/graphs'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class JourneysByDistance extends Vue{
  dashboard!: DashboardState  
  data:JourneysByDistanceInterface[] | [] = []
  def_url = "/pages/glossaire/#trajet"

  isLoading = false
  chartOptions = {
    responsive: true,
    plugins:{
      legend: {
        display: false
      }
    },
  }

  get monthList(){
    return this.$store.state.helpers.monthList
  }

  get chartData(){
    const chart:any = {
      labels:['< 10 km','10-20 km','20-30 km','30-40 km','40-50 km','> 50 km'],
      datasets:[],
    }
    chart.datasets.push({
      data:this.data.map(d=>d.journeys),
      backgroundColor: [
        '#08519c',
        '#3182bd',
        '#6baed6',
        '#9ecae1',
        '#c6dbef',
        '#eff3ff'
      ],
      datalabels: {
        labels: {
          name: {
            align: 'middle',
            font: function (context) {
              const avgSize = Math.round((context.chart.height + context.chart.width) / 2)
              const params = {
                  size: Math.round(avgSize / 24) > 10 ? 14 : Math.round(avgSize / 24),
                  weight: 'bold'
              }
              return params
            },
            color:'black',
            formatter: function(value, ctx) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
          value: {
            align: 'bottom',
            color:'black',
            font: function (context) {
              const avgSize = Math.round((context.chart.height + context.chart.width) / 2)
              const params = {
                  size: Math.round(avgSize / 24) > 10 ? 12 : Math.round(avgSize / 24),
              }
              return params
            },
            formatter: function(value, ctx) {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(1) + "%";
              return percentage;
            }
          }
        }
      },
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
    const response = await this.$axios.get(`/journeys_by_distance?territory=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
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