<template>
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
          <!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
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
          <!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
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
          <!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
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
          <!-- L'alternative de l'image (attribut alt) doit à priori rester vide car l'image est illustrative et ne doit pas être restituée aux technologies d’assistance. Vous pouvez toutefois remplir l'alternative si vous estimer qu'elle apporte une information essentielle à la compréhension du contenu non présente dans le texte -->
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
  nb_aires:0
}

public async mounted() {
  await this.getTime()
  await this.getData()
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
}

</script>