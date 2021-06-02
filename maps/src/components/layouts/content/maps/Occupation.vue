<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
          </div>
          <Legend :title="legendTitle" :analysis="categories" type="category"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <Legend v-if="map ==='droms'" :title="legendTitle" :analysis="categories" type="category"/>
          <div class="map_container">
            <div id="map_antilles"></div>
          </div>
          <div class="map_container">
            <div id="map_guyane"></div>
          </div>
          <div class="map_container">
            <div id="map_mayotte"></div>
          </div>
          <div class="map_container">
            <div id="map_reunion"></div>
          </div>
        </div>
        <Controls :map="map" @selectedMap="selectedMap"/>
      </div>
    </div>
  </div>
</template>

<script>
import Maps from '@/components/mixins/maps'
import Breakpoints from '@/components/mixins/breakpoints'
//import Sidebar from '@/components/layouts/sidebar/AiresSidebar'
import Controls from '@/components/layouts/content/Controls'
import Legend from '@/components/layouts/content/Legend'
import axios from 'axios'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/helpers'


export default {
  name: "Map",
  mixins:[Maps,Breakpoints],
  components: {
    //Sidebar,
    Controls,
    Legend
  },
  props:{
    map: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      map_metropole:null,
      map_antilles:null,
      map_guyane:null,
      map_mayotte:null,
      map_reunion:null,
      data:null,
      type:'epci',
      time:null,
      slider:[],
      loading: true,
      legendTitle:"Aires de covoiturage (source transport.data.gouv.fr)",
      categories:[
        {color:[102, 194, 165],val:'Supermarché',width:10,active:true},
        {color:[252, 141, 98],val:'Parking',width:10,active:true},
        {color:[141, 160, 203],val:'Aire de covoiturage',width:10,active:true},
        {color:[231, 138, 195],val:'Délaissé routier',width:10,active:true},
        {color:[166, 216, 84],val:'Auto-stop',width:10,active:true},
        {color:[255, 217, 47],val:'Parking relais',width:10,active:true},
        {color:[229, 196, 148],val:'Sortie d\'autoroute',width:10,active:true},
        {color:[179, 179, 179],val:'Autres',width:10,active:true}
      ]
    }
  },
  computed:{
    filteredData(){
      if(this.data){
        return turf.featureCollection(this.data.map(d => turf.feature(d.geom,{
          journeys:d.journeys,
          passengers:d.passengers,
          occupation_rate:d.occupation_rate
        })))
      }else{
        return null
      }
    },
    countData(){
      if(this.filteredData){
        return this.filteredData.features.length.toLocaleString('fr-FR')
      } else{
        return 0
      }
    }
  },
  async created() {
    await this.getTime()
    await this.getData()
    await this.renderMaps()
  },
  watch: {
    'filteredData':{ 
      handler: function() {
        for (let territory of this.territories) {
          if(this['map_'+territory.name]){
            this['map_'+territory.name].getSource('occupationSource').setData(this.filteredData)
          }
        }
      },
      deep:true
    }
  },
  methods:{
    async getTime(){
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
      this.time = response.data 
    },
    async getData(){
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_occupation?type='+this.type+'&year='+this.time.year+'&month='+this.time.month)
      this.data = response.data
      this.loading = false
    },
    async renderMaps() {
      if (this.map === 'metropole'){ 
        await this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map))
        this.addLayers('map_'+this.map)
        this['map_'+this.map].addControl(new maplibregl.NavigationControl(), 'top-left')
      } else if(this.map === 'droms'){
        for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
          await this.createMap('map_'+territory.name,territory)
          this.addLayers('map_'+territory.name)
        }
      } else {
        for (let territory of this.territories) {
          await this.createMap('map_'+territory.name,territory)
          this.addLayers('map_'+territory.name)
        }
        this.map_metropole.addControl(new maplibregl.NavigationControl(), 'top-left')
      }
    },
    addLayers(container) {
      this[container].on('style.load', () => {
        this[container].addSource('occupationSource', {
          type: 'geojson',
          data: this.filteredData
        })
        this[container].addLayer({
          id: 'occupationLayer',
          type: 'circle',
          source: 'occupationSource',
          paint: {
            'circle-radius': {
              property: 'journeys',
              type: 'exponential',
              stops: [
                [0, 0],
                [100, 5],
                [10000,20],
                [50000, 40]
              ]
            },   
            'circle-color': {
              property: 'occupation_rate',
              type: 'exponential',
              stops: [
                [2, '#FFEDA0'],
                [2.1, '#FED976'],
                [2.2, '#FEB24C'],
                [2.3, '#FD8D3C'],
                [2.4, '#FC4E2A'],
                [3, '#E31A1C']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
          }
        })

        let popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        })
        this[container].on('mouseenter', 'occupationLayer', e => {
          let features = this[container].queryRenderedFeatures(e.point)
          this[container].getCanvas().style.cursor = 'pointer'
          let description = `
            <div class="popup">
              <p><b>Trajets :</b>${features[0].properties.journeys}</p>
              <p><b>Passagers :</b>${features[0].properties.passengers}</p>
              <p><b>Nb d'occupants moyen par véhicule :</b>${features[0].properties.occupation_rate}</p>
            </div>`
          popup.setLngLat(e.lngLat)
          .setHTML(description)
          .addTo(this[container])
        })
        this[container].on('mouseleave', 'occupationLayer', () => {
          this[container].getCanvas().style.cursor = ''
          popup.remove()
        })
      })
     
    },
    selectedMap(){
      if (this.map === 'metropole'){
        this.$emit('rerenderMap', 'droms')
      } else {
        this.$emit('rerenderMap', 'metropole')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content{
  position: absolute;
  top: 105px;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 992px) {
    top: 130px;
  }
}
.map {
  :focus, :focus-visible {
    z-index: auto;
  }
  .maps_container {
    height: 100%;
    .controls{
      position:absolute;
      z-index: 1;
      padding: 0.2rem;
      margin: auto;
      background-color: #fff;
      width: 100%;
      .legend{
        padding:10px;
      }
    }
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
    border: 1px solid white;
  }
  .tooltip-title{
    font-size: 1.2em !important;
  }
}
</style>