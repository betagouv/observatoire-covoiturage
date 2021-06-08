<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="data" 
        :time="time"
        :journeys="allJourneys"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
          </div>
          <Legend :title="legendTitle" :analyzes="categories" type="proportional_circles"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <Legend v-if="map ==='droms'" :title="legendTitle" :analyzes="categories" type="proportional_circles"/>
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
import Sidebar from '@/components/layouts/sidebar/OccupationSidebar'
import Controls from '@/components/layouts/content/Controls'
import Legend from '@/components/layouts/content/Legend'
import axios from 'axios'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/helpers'


export default {
  name: "Map",
  mixins:[Maps,Breakpoints],
  components: {
    Sidebar,
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
      loading: true,
      categories:[
        {color:[229, 229, 224],val:'>= 50 000',width:40,active:true},
        {color:[229, 229, 224],val:'10 000',width:20,active:true},
        {color:[229, 229, 224],val:'100',width:10,active:true},
        {color:[229, 229, 224],val:'6',width:3,active:true}
      ]
    }
  },
  computed:{
    filteredData(){
      if(this.data){
        return turf.featureCollection(this.data.map(d => turf.feature(d.geom,{
          territory:d.territory,
          l_territory:d.l_territory,
          journeys:d.journeys,
          passengers:d.passengers,
          occupation_rate:d.occupation_rate
        })))
      }else{
        return null
      }
    },
    allJourneys(){
      if(this.filteredData){
        return this.filteredData.features.map(f=>f.properties.journeys).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
      } else{
        return 0
      }
    },
    legendTitle(){
      return "Trajets et occupation moyenne des véhicules par "+this.type
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
    },
    'time':{
      handler: function() {
        this.getData()
      },
      deep: true
    }
  },
  methods:{
    async getTime(){
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
      this.time = response.data 
    },
    async getData(){
      try{
        this.loading = true
        const response = await axios.get('http://localhost:8080/v1/journeys_monthly_occupation?type='+this.type+'&year='+this.time.year+'&month='+this.time.month)
        if(response.status === 204){
            this.$buefy.snackbar.open({
            message: response.data.message,
            actionText:null
          })
        }
        if(response.status === 200){
          this.data = response.data
        }
        this.loading = false
      }
      catch(error) {
        this.$buefy.snackbar.open({
          message: error.response.data.message,
          actionText:null
        })
        this.loading = false
      }
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
                [6, 3],
                [100, 10],
                [10000,20],
                [50000, 40]
              ]
            },   
            'circle-color': {
              property: 'occupation_rate',
              type: 'exponential',
              stops: [
                [2, '#E5E5F4'],
                [2.25, '#9A9AFF'],
                [2.5, '#7F7FC8'],
                [2.75, '#000091'],
                 [3, '#000074'],
                [4, '#00006D']
              ]
            },
            'circle-stroke-color': 'black',
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
              <p><b>${features[0].properties.l_territory}</b></p>
              <p>Trajets :${features[0].properties.journeys.toLocaleString('fr-FR')}</p>
              <p>Nb d'occupants moyen par véhicule :${features[0].properties.occupation_rate.toLocaleString('fr-FR')}</p>
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