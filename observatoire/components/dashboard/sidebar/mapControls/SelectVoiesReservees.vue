<template>
  <div>
    <label class="fr-sidemenu__title">
      Selectionner une voie :
    </label>
    <select v-model="selectedVoie" class="fr-select">
      <option v-for="voie in data.features" :value="voie" :key="voie">
        {{voie.properties.name}}
      </option>
    </select>
    <div class="fr-table fr-table--layout-fixed" v-if="selectedVoie">
      <table>
        <tbody>
          <tr>
            <td>Type</td>
            <td>{{selectedVoie.properties.type}}</td>
          </tr>
          <tr>
            <td>Gestion</td>
            <td>{{selectedVoie.properties.gestionnaire}}</td>
          </tr>
          <tr>
            <td>Localisation</td>
            <td>{{selectedVoie.properties.localisation}}</td>
          </tr>
          <tr>
            <td>Longueur</td>
            <td>{{selectedVoie.properties.distance}}</td>
          </tr>
          <tr>
            <td>Année de mise en service</td>
            <td>{{selectedVoie.properties.mise_en_service}}</td>
          </tr>
          <tr>
            <td>
              <a v-if="selectedVoie" :href=selectedVoie.properties.link target="_blank">
                En savoir + 
              </a>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="side-count">
      {{data.features.length}} voies de covoiturage recensées (source: 
      <a href="https://www.cerema.fr/fr/activites/mobilites/systemes-transports-intelligents-trafics-regulation/regulation-trafics/gestion-regulation-intelligentes-trafics" target="_blank">
        Cerema
      </a>)
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'
import json from '../../../../static/data/vr_covoiturage.json'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class SelectVoiesReservees extends Vue{
  dashboard!: DashboardState
  data = json
  selectedVoie:typeof json.features[0] | null = null
 
  @Watch('selectedVoie')
  onVoieChanged() {
    if(this.selectedVoie){
      this.$store.commit('dashboard/SELECTEDVOIE', this.selectedVoie.properties.name)
    }
  }
  
}
</script>