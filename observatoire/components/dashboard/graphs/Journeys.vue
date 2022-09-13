<template>
  <div class="fr-col">
    <div class="fr-tile">
      <div class="fr-tile__body">
        <bar-chart
          :chart-data="{
      labels: [ 'January', 'February', 'March' ],
      datasets: [ { data: [40, 20, 12] } ]
    }"
          chart-id='myCustomId'
          title="test"
          height="300"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { JourneysInterface } from '../../interfaces/graphs'
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
  data:JourneysInterface | [] = []

  get monthList(){
    return this.$store.state.helpers.monthList
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
    const response = await this.$axios.get(`/evolution/journeys_monthly_occupation?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
    this.data = response.data
  }
}
</script>