<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="map-title">
      <h5>Densité de départ ou d'arrivée de covoiturage dans la maille hexagonale</h5>
      <p>
        <NuxtLink to=/pages/glossaire/#passager target="_blank">
          <span class="fr-fi-information-line" aria-hidden="true"></span>
          définitions 
        </NuxtLink>
      </p>
    </div>
    <div class="fr-sidemenu__inner">
      
      <ul class="fr-sidemenu__list">
        
        <div class="slider">
          <b-field label="Période:">
            <b-field label="Début" custom-class="is-small">
              <b-datepicker 
                label-position="on-border"
                v-model=selectedTime.start
                :min-date=minTime 
                :max-date=maxTime
                icon="calendar-today"
                trap-focus
              />
            </b-field>
            <b-field label="Fin" custom-class="is-small">
              <b-datepicker 
                v-model=selectedTime.end
                :min-date=minTime
                :max-date=maxTime
                icon="calendar-today"
                trap-focus
              />
            </b-field>
          </b-field>
          <div class="fr-sidemenu__title">Zoom:</div>
          <b-slider v-model="selectedZoom" :min="1" :max="8" lazy ticks>
            <b-slider-tick :value="0">Min</b-slider-tick>
            <b-slider-tick :value="8">Max</b-slider-tick>
          </b-slider>
        </div>
      </ul>
      <b-field>
        <button v-if="!lgAndAbove" class="fr-btn--menu fr-btn" title="Menu" @click="openSidebar">
          Fermer
        </button>
      </b-field>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component,mixins,PropSync,Prop,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class DensiteSidebar extends mixins(BreakpointsMixin){
  @PropSync('zoom', { required: true, type: Number }) selectedZoom!: number
  @PropSync('time', { required: true, type: Object }) selectedTime!: { start:Date, end:Date }
  @Prop({ required: true }) maxTime!: Date

  minTime = new Date('01/01/2020')

  @Watch('time',{ deep: true })
  onTimeChanged() {
    this.$store.commit('screen/setSidebarOpen',false)
  }

  @Watch('value')
  onZoomChanged() {
    this.$store.commit('screen/setSidebarOpen',false)
  }
}
</script>

<style lang="scss" scoped>
  .slider{
    padding: 0 1em;
  }
  .fr-sidemenu__title{
    font-size: 1rem !important;
  }
</style>