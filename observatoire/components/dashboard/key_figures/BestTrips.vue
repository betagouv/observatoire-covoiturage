<template>
  <div class="fr-col">
    <div class="fr-tile">
      <div class="fr-tile__body">
        <div class="fr-table fr-table--layout-fixed">
          <table> 
            <caption>Les 10 trajets les plus covoiturés (tous sens confondus):</caption>
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line,index) in data" :key="index">
                <td>{{line.l_territory_1}} - {{line.l_territory_2}}</td>
                <td>{{line.journeys.toLocaleString()}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { BestTripsInterface } from '../../interfaces/keyfigures'
import { mapState } from 'vuex'
import { DashboardState } from 'store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class BestTrips extends Vue{
  dashboard!: DashboardState  
  data:BestTripsInterface | [] = []

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
    const response = await this.$axios.get(`/best_journeys?territory=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
    this.data = response.data
  }
}
</script>
<style lang="scss" scoped>
.fr-table td, .fr-table th{
  text-align: center;
  line-height: 1rem;
  padding: 0.5rem;
}
</style>