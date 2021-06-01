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
  created(){
    this.$store.commit('setMenuOpen',false)
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
  
  .mapboxgl-popup {
    font: 6px/10px Marianne, Arial, sans-serif;
  }
  .mapboxgl-ctrl-top-left{
    @media screen and (max-width: 992px) {
      top:50px !important;
    }
  }
</style>