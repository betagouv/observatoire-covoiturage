<template>
  <div class="fr-sidemenu__inner">
      <label class="fr-label" for="select">
        Selectionner une voie
      </label>
      <select v-model="selectedVoie" class="fr-select">
        <option v-for="voie in list.features" :value="voie.properties.name" :key="voie.properties.name">
          {{voie.properties.name}}
        </option>
      </select>
      <div class="fr-table fr-table--no-caption" v-if="selectedVoie">
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
          </tbody>
        </table>
      </div>
      <a v-if="selectedVoie" :href=selectedVoie.properties.link target="_blank">
        En savoir + 
      </a>
      <p class="side-count">
        {{list.features.length}} voies de covoiturage recensées (source: 
        <a href="https://www.cerema.fr/fr/activites/mobilites/systemes-transports-intelligents-trafics-regulation/regulation-trafics/gestion-regulation-intelligentes-trafics" target="_blank">
          Cerema
        </a>)
      </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
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
  list = json

  get selectedVoie(){
    return this.list.features.find(d => d.properties.name === this.dashboard.selectedVoie)
  }
  
}
</script>