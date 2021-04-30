<template>
  <div class="fr-grid-row maps_container">
    <div class="fr-col-12 fr-col-lg-9">
      <div id="map_metropole"></div>
    </div>
    <div class="fr-col-12 fr-col-lg-3 maps_drom">
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
  mounted() {
    this.init()
  }
};
</script>

<style lang="scss">
$bp-sm: 576px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1440px;
.maps_container {
  height: 86vh;
  @media screen and (min-width: $bp-sm) {
    min-height: 150vw;
  }
  @media screen and (min-width: $bp-md) {
    min-height: 30em;
  }
}
.maps_container *:focus,
.maps_container *:focus-visible {
  z-index: auto;
}
#map_metropole {
  width: 100%;
  height: 100%;
  border: 2px solid white;
}
.maps_drom {
  display: flex;
  flex-flow: column wrap;
  height: 100%;
}
.maps_drom .map_drom {
  height: 50%;
  width: 50%;
  border: 2px solid white;
}
</style>