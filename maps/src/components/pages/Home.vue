<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <Map :map="mobileMap" :key="mapKey" @rerenderMap="forceRerenderMaps"/>
    </div>
  </div>
</template>

<script>
import Map from '../layouts/content/maps/MonthlyFlux'
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'Home',
  mixins:[Breakpoints],
  components: {
    Map
  },
  data(){
    return{
      mapKey:0,
      selectedMap:'all'
    }
  },
  computed:{
    mobileMap(){
      if (this.lgAndAbove){
        return 'all'
      } else if (this.selectedMap === 'all'){
        return 'metropole'
      }else {
        return this.selectedMap
      }
    }
  },
  methods: {
    forceRerenderMaps(event) {
      this.selectedMap = event
      this.mapKey += 1
    }
  }
}
</script>
<style lang="scss">
  .slider, .map, .control_maps{
    // Set your colors
    $primary: #000091;
    @import "~bulma";
    @import "~buefy/src/scss/buefy";
  }
</style>