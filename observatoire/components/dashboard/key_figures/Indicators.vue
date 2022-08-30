<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-col-lg-6">
      <div class="fr-tile">
        <div class="fr-tile__body">
          <div class="fr-table">
            <table> 
              <tbody>
                <tr v-if="data.passengers">
                  <td> 
                    <span><o-icon pack="mdi" icon="hail" size="medium" variant="info" /></span>
                    <span><o-icon pack="mdi" icon="car" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#passager>
                      Passagers transportés
                    </NuxtLink>
                  </td>
                  <td>
                    {{data.passengers.toLocaleString()}}
                  </td>
                </tr>
                <tr v-if="data.has_incentive">
                  <td> 
                    <span><o-icon pack="mdi" icon="currency-eur" size="medium" variant="info" /></span>
                    <span><o-icon pack="mdi" icon="car" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#incentive>
                      Trajets incités
                    </NuxtLink>
                  </td>
                  <td>
                    {{data.has_incentive.toLocaleString()}}
                  </td>
                </tr>
                <tr v-if="data.trips">
                  <td> 
                    <span><o-icon pack="mdi" icon="car-2-plus" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#vehicule>
                      Véhicules partagés
                    </NuxtLink>
                  </td>
                  <td>
                    {{data.trips.toLocaleString()}}
                  </td>
                </tr>
                <tr v-if="data.occupation_rate">
                  <td> 
                    <span><o-icon pack="mdi" icon="account-group" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#occupation>
                      Taux d'occupation
                    </NuxtLink>
                  </td>
                  <td>
                    {{data.occupation_rate.toLocaleString()}}
                  </td>
                </tr>
                <tr v-if="data.distance">
                  <td> 
                    <span><o-icon pack="mdi" icon="map-marker-distance" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#km_parcourus>
                      Km parcourus
                    </NuxtLink>
                  </td>
                  <td>
                    {{Math.round(data.distance).toLocaleString()}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <div class="fr-tile">
        <div class="fr-tile__body">
          <div class="fr-table">
            <table> 
              <tbody>
                <tr v-if="data.distance">
                  <td> 
                    <span><o-icon pack="mdi" icon="map-marker-path" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#av-distance>
                      Distance moyenne
                    </NuxtLink>
                  </td>
                  <td>
                    {{(data.distance/data.passengers).toLocaleString('fr-FR',{maximumFractionDigits: 2})}} km
                  </td>
                </tr>
                <tr v-if="data.duration">
                  <td> 
                    <span><o-icon pack="mdi" icon="map-clock" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#duration>
                      Temps moyen
                    </NuxtLink>
                  </td>
                  <td>
                    {{Math.round((data.duration*60)/data.passengers).toLocaleString()}}  mn
                  </td>
                </tr>
                <tr v-if="data.distance">
                  <td>
                    <span><o-icon pack="mdi" icon="smoke" size="medium" variant="info" /></span> 
                    <span><o-icon pack="mdi" icon="molecule-co2" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#co2>
                      Tonnes de CO₂ économisés
                    </NuxtLink>
                  </td>
                  <td>
                    {{(data.distance*0.000195).toLocaleString('fr-FR',{maximumFractionDigits: 2})}}
                  </td>
                </tr>
                <tr v-if="data.distance">
                  <td> 
                    <span><o-icon pack="mdi" icon="barrel" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#petrole>
                      Litres de pétrole économisés
                    </NuxtLink>
                  </td>
                  <td>
                    {{Math.round(data.distance*0.0636).toLocaleString()}}
                  </td>
                </tr>
                <tr v-if="data.nb_aires">
                  <td> 
                    <span><o-icon pack="mdi" icon="car-off" size="medium" variant="info" /></span>
                  </td>
                  <td>
                    <NuxtLink to=/pages/glossaire/#aire>
                      Aires de covoiturage
                    </NuxtLink>
                  </td>
                  <td>
                    {{data.nb_aires.toLocaleString()}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { IndicatorsInterface } from '../../interfaces/keyfigures'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Indicators extends Vue{
  dashboard!: DashboardState  
  data:IndicatorsInterface | {} = {}
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
