<template>
  <div v-if="data.territory !== ''" class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col">
        <h1 class="h-text-center">Chiffres clés sur le territoire : {{data.l_territory.charAt(0)}}{{data.l_territory.slice(1).toLowerCase()}} ({{data.month}}/{{data.year}})</h1>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col">
        <div class="fr-grid-row">
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                <ul class="fr-btns-group fr-btns-group--inline fr-btns-group--center">
                  <li>
                    <button class="fr-btn" @click="changeDate">
                      Changer de date
                    </button>
                  </li>
                  <li>
                    <button class="fr-btn" @click="changeTerritory">
                      Changer de territoire
                    </button>
                  </li>
                </ul>
                <div v-if="changeDateOpen === true" class="fr-select-group">
                  <label class="fr-label" for="select-hint">Sélectionner un mois</label>
                  <select v-model="time.month" class="fr-select" id="select-month" name="select-month">
                    <option v-for="option in helpers.monthList" :value="option.id" :key="option.id">{{option.name}}</option>
                  </select>
                </div>
                <div v-if="changeDateOpen === true" class="fr-select-group">
                  <label class="fr-label" for="select-hint">Sélectionner une année</label>
                  <select v-if="changeDateOpen === true" v-model="time.year" class="fr-select" id="select-year" name="select-year">
                    <option v-for="option in helpers.yearList" :value="option" :key="option">{{option}}</option>
                  </select>
                </div>
                <div v-if="changeTerritoryOpen === true" class="fr-select-group">
                  <label class="fr-label" for="select-hint">Sélectionner le type de territoire</label>
                  <select v-model="type" class="fr-select" id="select-type" name="select-type">
                    <option v-for="option in helpers.territories" :value="option.type" :key="option.type">{{option.name}}</option>
                  </select>
                </div>
                <SearchTerritory v-if="changeTerritoryOpen === true" :year="time.year" :type="type" @changeTerritory="value => this.territory = value"/>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-grid-row">
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.journeys.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">passagers transportés</p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Trajet.svg" alt=""/>
              </div>
            </div>
          </div>
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.trips.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">véhicules partagés</p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Covoiturage.svg" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-grid-row">
          <div class="fr-col">
            <div class="fr-tile">
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
            <div class="fr-tile">
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
      </div>
      <div class="fr-col" v-if="best_journeys.length > 0">
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
                  <tr v-for="(line,index) in best_journeys" :key="index">
                    <td>{{line.l_territory_1}} - {{line.l_territory_2}}</td>
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
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { $axios } from '../utils/api'
import SearchTerritory from './SearchTerritory.vue'

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


@Component({
  components:{ SearchTerritory },
  computed:{
    ...mapState({
      helpers: 'helpers',
    })
  }
})
export default class Indicators extends Vue{
  $buefy:any
  loading=true
  changeDateOpen=false
  changeTerritoryOpen=false
  type='country'
  territory='XXXXX'
  time:Time={
    year:'',
    month:''
  }
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

  @Watch('time', { deep: true })
  onTimeChanged(val:Time, oldval:Time) {
    if (oldval.year !== '' || oldval.month !== ''){
      this.getData()
      this.getBestJourneys()
    }
  }

  @Watch('territory')
  onTerritoryChanged() {
      this.getData()
      this.getBestJourneys() 
  }

  public async getTime(){
    if (this.time.year === '' || this.time.month === ''){
      const response = await $axios.get('/journeys_monthly_flux/last')
      this.time = response.data
    }
  }
  
  public async getData(){
    try{
      const response = await $axios.get('/indicators?territory='+this.territory+'&t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
      if(response.status === 204){
          this.$buefy.snackbar.open({
          message: response.data.message,
          actionText:null
        })
      }
      if(response.status === 200){
        this.data = response.data[0]
      }
    }
    catch(error) {
      if (error.response) {
        this.$buefy.snackbar.open({
          message: error.response.data.message,
          actionText:null
        })
      }
      this.data = {
        year: this.time.year,
        month: this.time.month,
        territory: this.data.territory,
        l_territory:this.data.l_territory,
        journeys:0,
        occupation_rate:0,
        trips:0,
        nb_aires:0,
      }
    }
  }

  public async getBestJourneys(){
    try{
      const response = await $axios.get('/best_journeys?territory='+this.territory+'&t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
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
      if (error.response) {
        this.$buefy.snackbar.open({
          message: error.response.data.message,
          actionText:null
        })
      }
      this.best_journeys = []
    }
  }

  public changeDate(){
    this.changeDateOpen = !this.changeDateOpen
    this.changeTerritoryOpen = false
  }

  public changeTerritory(){
    this.changeTerritoryOpen = !this.changeTerritoryOpen
    this.changeDateOpen = false
  }
}

</script>
<style scoped>
.fr-table td, .fr-table th{
  text-align: center;
  line-height: 1rem;
  padding: 0.5rem;
}
.fr-tile__img{
  overflow:inherit !important;
}
</style>