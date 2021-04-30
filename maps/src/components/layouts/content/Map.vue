<template>
  <div class="fr-grid-row maps_container">
    <div class="fr-col-12 fr-col-lg-9">
      <div class="map_container">
        <div id="map_metropole"></div>
        <canvas id="deck_metropole"></canvas>
      </div>
    </div>
    <div class="fr-col-12 fr-col-lg-3 maps_drom">
      <div class="map_container">
        <div id="map_antilles"></div>
        <canvas id="deck_antilles"></canvas>
      </div>
      <div class="map_container">
        <div id="map_guyane"></div>
        <canvas id="deck_guyane"></canvas>
      </div>
      <div class="map_container">
        <div id="map_mayotte"></div>
        <canvas id="deck_mayotte"></canvas>
      </div>
      <div class="map_container">
        <div id="map_reunion"></div>
        <canvas id="deck_reunion"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import maps from '@/components/mixins/maps'

export default {
  name: "Map",
  mixins:[maps],
  async mounted() {
    await this.getData(),
    await this.renderMaps()
  },
};
</script>

<style lang="scss">
.maps_container {
  height: 86vh;
}
.maps_container *:focus,
.maps_container *:focus-visible {
  z-index: auto;
}
.map_container, .maps_drom {
  position:relative;
  display: flex;
  flex-flow: column wrap;
  height: 100%;
}
.map_container > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.maps_drom .map_container {
  height: 50%;
  width: 50%;
  border: 2px solid white;
}
</style>