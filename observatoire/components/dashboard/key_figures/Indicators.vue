<template>
  <div class="container">
    <div class="fr-tile">
      <div class="fr-tile__body">
        <h4>Concernant les trajets</h4>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="account-multiple" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{data.journeys.toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#trajet>
                      trajets réalisés
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <span><o-icon pack="mdi" icon="hail" size="large" variant="info" /></span>
                    <span><o-icon pack="mdi" icon="car" size="large" variant="info" /></span>
                  </div>
                  <h4 class="fr-card__title">
                    {{data.passengers.toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#passager>
                      Passagers transportés
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="car-2-plus" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{data.trips.toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#vehicule>
                      Véhicules partagés
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="account-group" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{data.occupation_rate.toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#occupation>
                      Taux d'occupation des véhicules / km
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-8">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <b>Répartition par tranche horaire</b>
                  <JourneysByHours />
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <b>Top 10 (tous sens confondus)</b>
                  <BestTrips />
                </div>
              </div>
            </div>
          </div>
        </div>
        <h4>Distances et durée</h4>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <JourneysByDistance />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="map-marker-path" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{(data.distance/data.passengers).toLocaleString('fr-FR',{maximumFractionDigits: 2})}} km
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#av-distance>
                      Distance moyenne
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-2">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="map-marker-distance" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{Math.round(data.distance).toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#km_parcourus>
                      Km parcourus
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-3">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="map-clock" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{Math.round((data.duration*60)/data.passengers).toLocaleString()}}  mn
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#duration>
                      Temps moyen
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h4>Environnement et infrastructures</h4>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <span><o-icon pack="mdi" icon="smoke" size="large" variant="info" /></span> 
                    <span><o-icon pack="mdi" icon="molecule-co2" size="large" variant="info" /></span>
                  </div>
                  <h4 class="fr-card__title">
                    {{(data.distance*0.000195).toLocaleString('fr-FR',{maximumFractionDigits: 2})}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#co2>
                      Tonnes de CO₂ économisés
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="barrel" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{Math.round(data.distance*0.0636).toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#petrole>
                      Litres de pétrole économisés
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-card fr-card--sm fr-card--no-border">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <div class="fr-card__start">
                    <o-icon pack="mdi" icon="car-off" size="large" variant="info" />
                  </div>
                  <h4 class="fr-card__title">
                    {{data.nb_aires.toLocaleString()}}
                  </h4>
                  <div class="fr-card__desc">
                    <NuxtLink to=/pages/glossaire/#aire>
                      Aires de covoiturage
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { IndicatorsInterface } from 'components/interfaces/keyfigures'
import { mapState } from 'vuex'
import { DashboardState } from 'store/dashboard'
import JourneysByHours from '../graphs/JourneysByHours.vue'
import BestTrips from './BestTrips.vue'
import JourneysByDistance from '../graphs/JourneysByDistance.vue'

@Component({
  components:{
    JourneysByHours,
    BestTrips,
    JourneysByDistance,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Indicators extends Vue{
  dashboard!: DashboardState  
  data:IndicatorsInterface = {
    trips:0,
    passengers:0,
    year: '',
    month:'',
    l_territory:'',
    territory:'',
    occupation_rate:0,
    nb_aires:0,
    journeys:0,
    distance:0,
    duration:0,
  }
  isLoading = false
  $oruga:any

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
    try{
      this.isLoading = true
      const response = await this.$axios.get(`/indicators?territory=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
      if(response.status === 204){
        this.$oruga.notification.open({
          message: response.data.message,
        })
      }
      if(response.status === 200){
        this.data = response.data[0]
      }
      this.isLoading = false
    }
    catch(error:any) {
      this.$oruga.notification.open({
        message: error.response.data.message,
      })
      this.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.fr-tile__img{
  overflow:inherit !important;
}
</style>
