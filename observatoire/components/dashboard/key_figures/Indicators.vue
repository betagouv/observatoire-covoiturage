<template>
  <section>
    <div class="fr-grid-row">
      <div class="fr-col">
        <h1 v-if="data.l_territory" class="h-text-center">
          Chiffres clés sur le territoire : {{data.l_territory.charAt(0)}}{{data.l_territory.slice(1).toLowerCase()}}
        </h1>
        <h2 v-if="period.month" class="h-text-center">
          Données concernant le mois : {{monthList.find(m=>m.id === Number(period.month)).name}} {{period.year}}
        </h2>
      </div>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col">
        <div class="fr-grid-row">
          <div v-if="data.passengers" class="fr-col">
            <div  class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.passengers.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#passager>
                      passagers transportés
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Pouce.svg" alt=""/>
              </div>
            </div>
          </div>
          <div v-if="data.has_incentive" class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.has_incentive.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#incentive>
                      trajets incités
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Incentive.svg" alt=""/>
              </div>
            </div>
          </div>
          <div v-if="data.trips" class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.trips.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#vehicule>
                      véhicules partagés
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Covoiturage.svg" alt=""/>
              </div>
            </div>
          </div>
          <div v-if="data.occupation_rate" class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.occupation_rate.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#occupation>
                      taux d'occupation
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/groupe.svg" alt=""/>
              </div>
            </div>
          </div>
          <div v-if="data.distance" class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{Math.round(data.distance).toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#km_parcourus>
                      km parcourus
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Km.svg" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div v-if="data.distance" class="fr-grid-row">
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{(data.distance/data.passengers).toLocaleString('fr-FR',{maximumFractionDigits: 2})}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#av-distance>
                      distance moyenne (en km)
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Trip.svg" alt=""/>
              </div>
            </div>
          </div>
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{Math.round((data.duration*60)/data.passengers).toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#duration>
                      temps moyen (en mn)
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Clock.svg" alt=""/>
              </div>
            </div>
          </div>
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{(data.distance*0.000195).toLocaleString('fr-FR',{maximumFractionDigits: 2})}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#co2>
                      tonnes de CO₂ économisés
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Co2.svg" alt=""/>
              </div>
            </div>
          </div>
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{Math.round(data.distance*0.0636).toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#petrole>
                      litres de pétrole économisés
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Petrole.svg" alt=""/>
              </div>
            </div>
          </div>
          <div class="fr-col">
            <div class="fr-tile">
              <div class="fr-tile__body">
                  <h4 class="fr-tile__title">
                      {{data.nb_aires.toLocaleString()}}
                  </h4>
                  <p class="fr-tile__desc">
                    <NuxtLink to=/pages/glossaire/#aire>
                      aires de covoiturage
                    </NuxtLink>
                  </p>
              </div>
              <div class="fr-tile__img">
                <img src="/images/Parking.svg" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { IndicatorsInterface } from '../../interfaces/keyfigures'
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'

@Component
export default class Indicators extends Vue{
  @Prop({ required: true }) period!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: TerritoryInterface
  

  data:IndicatorsInterface | {} = {}

  get monthList(){
    return this.$store.state.helpers.monthList
  }

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
    const response = await this.$axios.get(`/indicators?territory=${this.territory.territory}&t=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    response.status === 200 ? this.data = response.data[0] : this.data = {}
  }
}
</script>
<style lang="scss" scoped>
.fr-tile__img{
  overflow:inherit !important;
}
</style>
