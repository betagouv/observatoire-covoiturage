<template>
  <div v-if="data.territory !== ''" class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col">
        <h1 class="h-text-center">Chiffres clés sur le terrritoire : {{data.l_territory.charAt(0)}}{{data.l_territory.slice(1).toLowerCase()}} ({{data.month}}/{{data.year}})</h1>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col">
        <div class="fr-tile fr-tile--horizontal">
          <div class="fr-tile__body">
              <h4 class="fr-tile__title">
                  {{data.journeys.toLocaleString()}}
              </h4>
              <p class="fr-tile__desc">trajets réalisés</p>
          </div>
          <div class="fr-tile__img">
            <img src="/images/Trajet.svg" alt=""/>
          </div>
        </div>
      </div>
      <div class="fr-col">
        <div class="fr-tile fr-tile--horizontal">
          <div class="fr-tile__body">
              <h4 class="fr-tile__title">
                  {{data.trips.toLocaleString()}}
              </h4>
              <p class="fr-tile__desc">voyages réalisés</p>
          </div>
          <div class="fr-tile__img">
            <img src="/images/Covoiturage.svg" alt=""/>
          </div>
        </div>
      </div>
      <div class="fr-col">
        <div class="fr-tile fr-tile--horizontal">
          <div class="fr-tile__body">
              <h4 class="fr-tile__title">
                  {{data.occupation_rate.toLocaleString()}}
              </h4>
              <p class="fr-tile__desc">personnes par véhicule</p>
          </div>
          <div class="fr-tile__img">
            <img src="/images/groupe.svg" alt=""/>
          </div>
        </div>
      </div>
      <div class="fr-col">
        <div class="fr-tile fr-tile--horizontal">
          <div class="fr-tile__body">
              <h4 class="fr-tile__title">
                  {{data.nb_aires.toLocaleString()}}
              </h4>
              <p class="fr-tile__desc">aires de covoiturage</p>
          </div>
          <div class="fr-tile__img">
            <img src="/images/Parking.svg" alt=""/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="best_journeys.length > 0" class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col">
        <div class="fr-tile">
          <div class="fr-tile__body">
            <div class="fr-table fr-table--layout-fixed">
              <table> 
                <caption>10 trajets les plus covoiturés (tout sens confondus):</caption>
                <thead>
                  <tr>
                    <th scope="col">Code INSEE territoire 1</th>
                    <th scope="col">Nom territoire 1</th>
                    <th scope="col">Code INSEE territoire 2</th>
                    <th scope="col">Nom territoire 2</th>
                    <th scope="col">Nombre de trajets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(line,index) in best_journeys" :key="index">
                    <td>{{line.territory_1}}</td>
                    <td>{{line.l_territory_1}}</td>
                    <td>{{line.territory_2}}</td>
                    <td>{{line.l_territory_2}}</td>
                    <td>{{line.journeys.toLocaleString()}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import axios from 'axios'

interface IndicatorsData {
  year: string,
  month: string,
  territory:string,
  l_territory:string,
  journeys:number,
  occupation_rate:number,
  trips:number,
  nb_aires:number
}
interface Time {year:string,month:string}


@Component
export default class Indicators extends Vue{
  @Prop({default:{year:'',month:''}}) time!:Time
  $buefy:any
  loading=true
  type='country'
  territory='XXXXX'
  data:IndicatorsData={
    year: '',
    month: '',
    territory:'',
    l_territory:'',
    journeys:0,
    occupation_rate:0,
    trips:0,
    nb_aires:0,
  }
  best_journeys= []

  public async mounted() {
    await this.getTime()
    await this.getData()
    await this.getBestJourneys()
  }

  public async getTime(){
    if (this.time.year === '' || this.time.month === ''){
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
      this.time = response.data
    }
  }
  public async getData(){
    try{
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/indicators?territory='+this.territory+'&t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
      if(response.status === 204){
          this.$buefy.snackbar.open({
          message: response.data.message,
          actionText:null
        })
      }
      if(response.status === 200){
        this.data = response.data[0]
      }
      this.loading = false
    }
    catch(error) {
      this.$buefy.snackbar.open({
        message: error.response.data.message,
        actionText:null
      })
      this.loading = false
    }
  }

  public async getBestJourneys(){
    try{
      const response = await axios.get('http://localhost:8080/v1/best_journeys?territory='+this.territory+'&t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
      if(response.status === 204){
          this.$buefy.snackbar.open({
          message: response.data.message,
          actionText:null
        })
      }
      if(response.status === 200){
        this.best_journeys = response.data
      }
    }
    catch(error) {
      this.$buefy.snackbar.open({
        message: error.response.data.message,
        actionText:null
      })
    }
  }
}

</script>