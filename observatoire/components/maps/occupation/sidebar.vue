<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="fr-sidemenu__inner">
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Type de territoire sélectionné :</div>
        <li class="fr-sidemenu__item">
          <b-field>
            <select v-model="selectedType" class="fr-select" id="select-type" name="select-type">
              <option v-for="option in territories" :value="option.type" :key="option.type">{{option.name}}</option>
            </select>
          </b-field>
        </li>
      </ul>
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Mois sélectionné :</div>
        <li class="fr-sidemenu__item">
          <b-field grouped>
            <b-field>
              <select v-model="selectedTime.month" class="fr-select" id="select-month" name="select-month">
                <option v-for="option in monthList" :value="option.id" :key="option.id">{{option.name}}</option>
              </select>
            </b-field>
            <b-field>
              <select v-model="selectedTime.year" class="fr-select" id="select-year" name="select-year">
                <option v-for="option in yearList" :value="option" :key="option">{{option}}</option>
              </select>
            </b-field>
          </b-field>
        </li>
      </ul>
      <p>{{journeys}} trajets dans le registre de preuve de covoiturage (un trajet correspond un couple conducteur-pasager)</p>
      <b-field>
        <button v-if="!lgAndAbove" class="fr-btn--menu fr-btn" title="Menu" @click="openSidebar">
          Fermer
        </button>
      </b-field>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, mixins, PropSync, Prop, Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import TimeMixin from '../../mixins/time'

@Component
export default class OccupSidebar extends mixins(BreakpointsMixin, TimeMixin){
  @PropSync('type', { required: true, type: String }) selectedType!: String
  @PropSync('time', { required: true, type: Object }) selectedTime!: { year: String, month: String }
  @Prop({ required: true }) journeys!: string

  territories = [
    {type:'com',name:'Communes'},
    {type:'epci',name:'EPCI'},
    {type:'dep',name:'Départements'},
    {type:'reg',name:'Régions'},
    {type:'country',name:'Pays'}
  ]

  @Watch('time',{ deep: true })
  onTimeChanged() {
    this.$store.commit('screen/setSidebarOpen',false)
  }

  @Watch('type')
  onTypeChanged() {
    this.$store.commit('screen/setSidebarOpen',false)
  }
}
</script>

<style lang="scss" scoped>
  .fr-sidemenu__title{
    font-size: 1rem !important;
  }
</style>