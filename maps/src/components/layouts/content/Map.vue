<template>
  <div class="fr-grid-row content">
    <div class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="flux" 
        v-model="slider" 
        :time="time"
        :sliderOptions="{'min':0,'max':this.defaultSlider('vehicles')[1],'step':5}"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <div class="fr-grid-row maps_container">
        <div class="fr-col-12 fr-col-lg-9 map_metropole">
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

export default {
  name: "Map",
  mixins:[maps],
  components: {
    Sidebar
  },
  data(){
    return {
      flux:null,
      filteredFlux: this.flux,
      time:{
        year: '2021',
        month: '03'
      },
      slider:[]
    }
  },
  computed:{
    jenksVehicles(){
      return this.jenks(this.flux,'vehicles',['#9478c7','#8a6dc1','#7455b7','#5335a7','#2c1599','#000091'],[1,5,10,20,40,80])
    }
  },
  async mounted() {
    await this.getData()
    this.renderMaps()
  },
  watch:{
    slider(){
      this.filterFlux('vehicles')
    },
    'time':{
      handler: function() {
        this.getData()
      },
      deep: true
    }   
  },
  methods:{
    async getData(){
      const response = await axios.get('http://localhost:8080/v1/monthly_flux?year='+this.time.year+'&month='+this.time.month)
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
        data:this.filteredFlux,
        opacity:0.4,
        pickable: true,
        getWidth: d => this.classWidth( d.vehicles,this.jenksVehicles),
        getSourcePosition: d => [d.com1_lng,d.com1_lat],
        getTargetPosition: d => [d.com2_lng,d.com2_lat],
        getSourceColor: [0,0,145],
        getTargetColor:  [0,0,145],
      })
    },
    defaultSlider(field){
      if(this.flux){
        const values = this.flux.map(d => d[field])
        return [Math.min(...values),Math.max(...values)]
      }else{
        return []
      }
    },
    filterFlux(field){
      this.filteredFlux = this.flux.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
      for (let territory of this.territories) {
        if(this['deck_'+territory.name]){
          this['deck_'+territory.name].setProps({layers:[this.addArcLayer()]})
        }
      }
      
    }
  }
};
</script>

<style lang="scss" scoped>
.content{
  position: absolute;
  top: 170px;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 1440px) {
    top: 130px;
  }
}
.map {
  .maps_container {
    height: 100%;
  }
  .map_container > * {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .maps_container *:focus,
  .maps_container *:focus-visible {
    z-index: auto;
  }
  .map_container, .maps_drom, .map_metropole {
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