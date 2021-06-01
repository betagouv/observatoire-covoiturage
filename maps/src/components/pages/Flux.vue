<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <Map :map="selectedMap" :key="mapKey" @rerenderMap="forceRerenderMaps"/>
    </div>
  </div>
</template>

<script>
import Map from '../layouts/content/maps/MonthlyFlux'
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'Flux',
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
