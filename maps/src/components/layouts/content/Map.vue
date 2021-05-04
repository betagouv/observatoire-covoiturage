<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar/>
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
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
    </div>
  </div>
</template>

<script>
import maps from '@/components/mixins/maps'
import Sidebar from '@/components/layouts/sidebar/Sidebar'
import {ArcLayer} from '@deck.gl/layers'
import axios from 'axios'
import { mapState } from "vuex"

export default {
  name: "Map",
  mixins:[maps],
  components: {
    Sidebar
  },
  data(){
    return {
      flux:null,
      year: '2021',
      month: '03'
    }
  },
  computed:{
    ...mapState({
      slider:state => state.filters.slider,
    }),
    equalIntervalVehicles(){
      return this.equalInterval(this.flux,'vehicles',['#99d8c9','#66c2a4','#41ae76','#238b45','#005824'],[3,6,12,24,48])
    }
  },
  async mounted() {
    await this.getData()
    this.renderMaps()
  },
  methods:{
    async getData(){
      const response = await axios.get("http://localhost:8080/v1/monthly_flux?year='"+this.year+"'&month='"+this.month+"'")
      this.flux = response.data
      this.slider = this.defaultSlider('vehicles')
    },
    renderMaps() {
      for (let territory of this.territories) {
        this.createMap('map_'+territory.name,territory)
        this.createDeck('deck_'+territory.name,territory,this.addArcLayer())
      }
    },
    addArcLayer(){
      return new ArcLayer({
        id: 'flux-layer',
        data:this.flux,
        opacity:0.6,
        pickable: true,
        getWidth: d => this.classWidth( d.vehicles,this.equalIntervalVehicles),
        getSourcePosition: d => [d.com1_lng,d.com1_lat],
        getTargetPosition: d => [d.com2_lng,d.com2_lat],
        getSourceColor: d => this.classColor( d.vehicles,this.equalIntervalVehicles),
        getTargetColor: d => this.classColor( d.vehicles,this.equalIntervalVehicles),
      })
    },
    defaultSlider(field){
      const values = this.flux.map(d => d[field])
      return [Math.min(...values),Math.max(...values)]
    }
  }
};
</script>

<style lang="scss" scoped>

.sidebar {
  .fr-sidemenu--sticky-full-height {
    height: 86vh;
    overflow-y: hidden;
  }
}
.map {
  .maps_container {
    height: 86vh;
  }
  .map_container > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
  .maps_drom .map_container {
    height: 50%;
    width: 50%;
    border: 2px solid white;
  }
}
</style>