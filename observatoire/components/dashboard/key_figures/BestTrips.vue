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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { BestTripsInterface } from '../../interfaces/keyfigures'

@Component
export default class BestTrips extends Vue{
  @Prop({ required: true }) data!: Array<BestTripsInterface>
}
</script>
<style lang="scss" scoped>
.fr-table td, .fr-table th{
  text-align: center;
  line-height: 1rem;
  padding: 0.5rem;
}
</style>