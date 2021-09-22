<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <client-only>
        <Map :map="selectedMap" :key="mapKey" @rerenderMap="forceRerenderMaps"/>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../components/mixins/breakpoints'
import Map from '../../components/maps/aires/map.vue'

@Component({
  components:{Map}
})
export default class Aires extends mixins(BreakpointsMixin){
  mapKey = 0
  selectedMap ='all'

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