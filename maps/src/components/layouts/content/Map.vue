<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove" class="fr-col-2 sidebar">
      <Sidebar 
        v-if="flux" 
        v-model="slider" 
        :time="time"
        :sliderOptions="{'min':0,'max':this.defaultSlider('vehicles')[1],'step':5}"
        :vehicles ="allVehicles"
        :covoit ="allCovoit"
      />
    </div>
    <div class="fr-col-12 fr-col-md-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div class="fr-col-12 fr-col-md-9 map_metropole">
          <div class="map_container">
            <canvas id="deck_metropole" class="deck"></canvas>
            <div id="map_metropole"></div>
          </div>
        </div>
        <div class="fr-col-12 fr-col-md-3 maps_drom">
          <div class="map_container">
            <canvas id="deck_antilles" class="deck"></canvas>
            <div id="map_antilles"></div>
          </div>
          <div class="map_container">
            <canvas id="deck_guyane" class="deck"></canvas>
            <div id="map_guyane"></div>
          </div>
          <div class="map_container">
            <canvas id="deck_mayotte" class="deck"></canvas>
            <div id="map_mayotte"></div>
          </div>
          <div class="map_container">
            <canvas id="deck_reunion" class="deck"></canvas>
            <div id="map_reunion"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Maps from '@/components/mixins/maps'
import Breakpoints from '@/components/mixins/breakpoints'
import Sidebar from '@/components/layouts/sidebar/Sidebar'
import {ArcLayer} from '@deck.gl/layers'
import axios from 'axios'

export default {
  name: "Map",
  mixins:[Maps,Breakpoints],
  components: {
    Sidebar
  },
  data(){
    return {
      map_metropole:null,
      map_antilles:null,
      map_guyane:null,
      map_mayotte:null,
      map_reunion:null,
      deck_metropole:null,
      deck_antilles:null,
      deck_guyane:null,
      deck_mayotte:null,
      deck_reunion:null,
      flux:null,
      filteredFlux: this.flux,
      time:null,
      slider:[],
      loading: true,
    }
  },
  computed:{
    jenksVehicles(){
      return this.jenks(this.flux,'vehicles',['#9478c7','#8a6dc1','#7455b7','#5335a7','#2c1599','#000091'],[1,5,10,20,40,80])
    },
    allVehicles(){
      if(this.filteredFlux){
        return this.filteredFlux.map(f=>f.vehicles).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
      } else{
        return 0
      }
    },
    allCovoit(){
      if(this.filteredFlux){
        return this.filteredFlux.map(f=>(f.vehicles+f.passengers)).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
      } else{
        return 0
      }
    }
  },
  async created() {
    await this.getTime()
    await this.getData()
  },
  async mounted(){
    await this.renderMaps()
    await this.renderDecks()

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
    },
    'screen.window':{
      handler: function() {
        for (let territory of this.territories) {
          this['deck_'+territory.name].setProps({
            ...this['deck_'+territory.name].props,
            width: "100%",
            height: "100%",
          })
        }
      },
      deep: true
    }   
  },
  methods:{
    async getTime(){
      const response = await axios.get('http://localhost:8080/v1/monthly_flux/last')
      this.time = response.data 
    },
    async getData(){
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/monthly_flux?year='+this.time.year+'&month='+this.time.month)
      this.flux = response.data
      this.slider = this.defaultSlider('vehicles')
      this.loading = false
    },
    async renderMaps() {
      for (let territory of this.territories) {
        this.createMap('map_'+territory.name,territory)
      }
    },
    async renderDecks() {
      for (let territory of this.territories) {
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
    async filterFlux(field){
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

<style lang="scss">
.content{
  position: absolute;
  top: 170px;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 992px) {
    top: 130px;
  }
}
.map {
  *:focus, *:focus-visible {
    z-index: auto;
  }
  .deck{
    z-index: 1;
  }
  .maps_container {
    height: 100%;
  }
  .map_container > * {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
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
  .tooltip-title{
    font-size: 1.2em !important;
  }
}
</style>