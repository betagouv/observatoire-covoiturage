<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="map-title">
      <h5>Voies réservées au covoiturage sur le territoire français</h5>
      <p>
        <NuxtLink to=/pages/glossaire/#voie target="_blank">
          <span class="fr-fi-information-line" aria-hidden="true"></span>
          définitions 
        </NuxtLink>
      </p>
    </div>
    <div class="fr-sidemenu__inner">
      <label class="fr-label" for="select">
        Selectionner une voie
      </label>
      <select v-model="selected" class="fr-select">
        <option v-for="voie in this.features" :value="voie" :key="voie.properties.name">
          {{voie.properties.name}}
        </option>
      </select>
      <div class="fr-table fr-table--no-caption" v-if="selected">
        <table>
          <tbody>
            <tr>
              <td>Type</td>
              <td>{{selected.properties.type}}</td>
            </tr>
            <tr>
              <td>Gestion</td>
              <td>{{selected.properties.gestionnaire}}</td>
            </tr>
            <tr>
              <td>Localisation</td>
              <td>{{selected.properties.localisation}}</td>
            </tr>
            <tr>
              <td>Longueur</td>
              <td>{{selected.properties.distance}}</td>
            </tr>
            <tr>
              <td>Année de mise en service</td>
              <td>{{selected.properties.mise_en_service}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <a v-if="selected" :href=selected.properties.link target="_blank">
        En savoir + 
      </a>
      <p class="side-count">
        {{features.length}} voies de covoiturage recensées (source: 
        <a href="https://www.cerema.fr/fr/activites/mobilites/systemes-transports-intelligents-trafics-regulation/regulation-trafics/gestion-regulation-intelligentes-trafics" target="_blank">
          Cerema
        </a>)
      </p>
      <b-field>
        <button v-if="!lgAndAbove" class="fr-btn--menu fr-btn" title="Menu" @click="openSidebar">
          Fermer
        </button>
      </b-field>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component,mixins,Prop,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class VoieSidebar extends mixins(BreakpointsMixin){
  @Prop({ required: true }) features!: Array<Object>
  selected=null

  @Watch('selected',{ deep: true })
  onSelectedChanged() {
    this.$emit('update',this.selected)
  }
}
</script>