<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <MapsOccupationMap :map="selectedMap" :key="mapKey" @rerenderMap="forceRerenderMaps"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../components/mixins/breakpoints'

@Component
export default class Occupation extends mixins(BreakpointsMixin){
  mapKey = 0
  selectedMap = 'all'

  layout () {
    return 'carte'
  }
  
  created(){
    this.$store.commit('screen/setMenuOpen',false)
  }

  mounted(){
    this.resize()
  }

  @Watch('lgAndAbove')
  onlgAndAboveChanged() {
    this.resize()
    this.mapKey += 1
  }

  resize(){
    if (this.lgAndAbove){
      this.selectedMap = 'all'
    } else {
      this.selectedMap = 'metropole'
    }
  }

  forceRerenderMaps(event) {
    this.selectedMap = event
    this.mapKey += 1
  }
}
</script>
