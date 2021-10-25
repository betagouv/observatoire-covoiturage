<template>
  <nav class="fr-sidemenu--full-border" :class="{'fr-p-1w': !lgAndAbove}" role="navigation" aria-label="Menu latéral">
    <div class="map-title">
      <h5>Flux mensuels de passagers transportés en covoiturage entre territoires</h5>
      <p>
        <NuxtLink to=/pages/glossaire/#passager target="_blank">
          <span class="fr-fi-information-line" aria-hidden="true"></span>
          définitions 
        </NuxtLink>
      </p>
    </div>
    <div class="fr-sidemenu__inner">
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Flux entre :</div>
        <li class="fr-sidemenu__item">
          <b-field>
            <select v-model="selectedType" class="fr-select" id="select-type" name="select-type">
              <option v-for="option in helpers.territories" :value="option.type" :key="option.type">{{option.name}}</option>
            </select>
          </b-field>
        </li>
      </ul>
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Période (Mois) :</div>
        <li class="fr-sidemenu__item">
          <select v-model="selectedTime.month" class="fr-select" id="select-month" name="select-month">
            <option v-for="option in helpers.monthList" :value="option.id" :key="option.id">{{option.name}}</option>
          </select>
          <select v-model="selectedTime.year" class="fr-select" id="select-year" name="select-year">
            <option v-for="option in helpers.yearList" :value="option" :key="option">{{option}}</option>
          </select>
        </li>
      </ul>
      <ul class="fr-sidemenu__list">
        <div class="fr-sidemenu__title">Nombre de passagers par flux:</div>
        <Slider :value.sync="selectedValue" :sliderOptions="{'min':sliderOptions.min,'max':sliderOptions.max,'step':sliderOptions.step}"/>
      </ul>
      <p class="side-count">{{journeys}} passagers transportés selon les critères sélectionnés ci-dessus</p>
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
import { mapState } from 'vuex'
import Slider from '../helpers/slider.vue'

@Component({
  components:{Slider},
  computed:{
    ...mapState({
      helpers: 'helpers',
    })
  }
})
export default class FluxSidebar extends mixins(BreakpointsMixin){
  @PropSync('type', { required: true, type: String }) selectedType!: String
  @PropSync('value', { required: true, type: Array }) selectedValue!: [number,number]
  @PropSync('time', { required: true, type: Object }) selectedTime!: { year: String, month: String }
  @Prop({ required: true }) sliderOptions!: { min: Number, max: Number, step: Number }
  @Prop({ required: true }) journeys!: string

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
  .slider{
    padding: 0 1em;
  }
  .fr-sidemenu__title{
    font-size: 1rem !important;
  }
</style>