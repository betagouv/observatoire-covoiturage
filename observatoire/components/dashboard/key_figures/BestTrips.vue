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
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'

@Component
export default class BestTrips extends Vue{
  @Prop({ required: true }) period!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: TerritoryInterface
  
  data:BestTripsInterface | [] = []

  public mounted(){
    this.getData()
  }

  @Watch('period', { deep: true })
  onPeriodChanged() {
    this.getData()
  }
  
  @Watch('territory', { deep: true })
  onTerritoryChanged() {
    this.getData()
  }

  public async getData(){
    const response = await this.$axios.get(`/best_journeys?territory=${this.territory.territory}&t=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
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