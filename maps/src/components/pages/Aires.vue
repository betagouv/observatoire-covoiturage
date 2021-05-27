<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <Map :map="selectedMap" :key="mapKey" @rerenderMap="forceRerenderMaps"/>
    </div>
  </div>
</template>

<script>
import Map from '../layouts/content/maps/Aires'
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'Aires',
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
  mounted(){
    this.resize()
  },
  watch:{
    lgAndAbove(){
      this.resize()
      this.mapKey += 1
    }
  },
  methods: {
    resize(){
      if (this.lgAndAbove){
        this.selectedMap = 'all'
      } else {
        this.selectedMap = 'metropole'
      }
    },
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