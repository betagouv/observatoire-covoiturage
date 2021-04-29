<template>
  <div class="maps_container">
    <div id="map_metropole"></div>
    <div class="maps_drom">
      <div id="map_antilles" class="map_drom"></div>
      <div id="map_guyane" class="map_drom"></div>
      <div id="map_mayotte" class="map_drom"></div>
      <div id="map_reunion" class="map_drom"></div>
    </div>
  </div>
</template>

<script>
import maps from '@/components/mixins/maps'
export default {
  name: "Map",
  mixins:[maps],
  async mounted() {
    this.init()
  },
};
</script>
<style lang="scss" scoped>
  .maps_container{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    > *{
      flex: 1 1 100%;
    }
  }
  #map_metropole{
    height: 86vh;
  }
</style>