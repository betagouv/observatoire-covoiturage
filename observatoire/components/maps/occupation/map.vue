<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <MapsOccupationSidebar 
        v-if="data"
        :type.sync="type" 
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
          <MapsHelpersLegend :title="legendTitleJourneys" :analyzes="categories" type="proportional_circles" class="upper_legend"/>
          <MapsHelpersLegend :title="legendTitleOccupation" :analyzes="analyse" type="interval"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <MapsHelpersLegend v-if="map ==='droms'" :title="legendTitleJourneys" :analyzes="categories" type="proportional_circles"/>
          <MapsHelpersLegend v-if="map ==='droms'" :title="legendTitleOccupation" :analyzes="analyse" type="interval"/>
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
        <MapsHelpersControls :map="map" @selectedMap="selectedMap"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Prop,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import MapsMixin from '../../mixins/maps'
import * as turf from '@turf/helpers'
import maplibregl from 'maplibre-gl'
import axios from 'axios'

interface OccupData {
  territory:string,
  l_territory:string,
  journeys:number,
  passengers:number,
  occupation_rate:number,
  geom:{properties:{ type:string,coordinates:[number,number]}}
}

interface Time {year:string,month:string}

@Component
export default class OccupMap extends mixins(BreakpointsMixin,MapsMixin){
  @Prop({ required: true }) map!: string

  map_metropole:any=null
  map_antilles:any=null
  map_guyane:any=null
  map_mayotte:any=null
  map_reunion:any=null
  time:Time={
    year:'',
    month:''
  }
  type='epci'
  data:Array<OccupData>=[]
  loading=true
  categories=[
    {color:[229, 229, 224],val:'>= 100 000',width:40,active:true},
    {color:[229, 229, 224],val:'10 000',width:20,active:true},
    {color:[229, 229, 224],val:'100',width:10,active:true},
    {color:[229, 229, 224],val:'10',width:5,active:true}
  ]
  analyse= [
    {color:[229, 229, 244],val:2,width:10,active:true},
    {color:[154, 154, 255],val:2.25,width:10,active:true},
    {color:[127, 127, 200],val:2.5,width:10,active:true},
    {color:[0, 0, 145],val:2.75,width:10,active:true},
    {color:[0, 0, 116],val:3,width:10,active:true},
    {color:[0, 0, 109],val:4,width:10,active:true},
  ]
  $buefy:any

  get filteredData(){
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
  }

  get allJourneys(){
    if(this.filteredData){
      return this.filteredData.features.map(f=>f.properties.journeys).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
    } else{
      return 0
    }
  }

  get legendTitleJourneys(){
    return "Nb de voyages par "+this.$store.state.helpers.territories.find(t => t.type === this.type).name.toLowerCase() 
  }

  get legendTitleOccupation(){
    return "Occupation moyenne des véhicules" 
  }
  
  @Watch('time', { deep: true })
  onTimeChanged(val:Time, oldval:Time) {
    if (oldval.year !== '' || oldval.month !== ''){
      this.getData()
    }
  }
  
  @Watch('type')
  onTypeChanged() {
    this.getData()
    //this.test()
  }

  @Watch('filteredData', { deep: true })
  onDataChanged() {
    for (let territory of this.territories) {
      if(this.$data['map_'+territory.name]){
        this.$data['map_'+territory.name].getSource('occupationSource').setData(this.filteredData)
      }
    }
  }

  public async created() {
    await this.getTime()
    await this.getData()
    await this.renderMaps()
  }

  public async getTime(){
    const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
    this.time = response.data 
  }

  public async getData(){
    try{
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_occupation?t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
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
  }

  public async renderMaps() {
    if (this.map === 'metropole'){ 
      await this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map) || this.territories[0])
      this.addLayers('map_'+this.map)
      this.$data['map_'+this.map].addControl(new maplibregl.NavigationControl(), 'top-left')
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
  }

  public addLayers(container:string) {
    this.$data[container].on('style.load', () => {
      this.$data[container].addSource('occupationSource', {
        type: 'geojson',
        data: this.filteredData
      })
      this.$data[container].addSource('decoupageSource', {
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json'
      })
      this.$data[container].addLayer({
        id: 'occupationLayer',
        type: 'circle',
        source: 'occupationSource',
        paint: {
          'circle-radius': {
            property: 'journeys',
            type: 'exponential',
            stops: [
              [0,0],
              [10, 5],
              [100, 10],
              [10000,20],
              [100000, 40]
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
      this.$data[container].on('mouseenter', 'occupationLayer', e => {
        let features = this.$data[container].queryRenderedFeatures(e.point)
        this.$data[container].getCanvas().style.cursor = 'pointer'
        let description = `
          <div class="popup">
            <p><b>${features[0].properties.l_territory}</b></p>
            <p>Voyages :${features[0].properties.journeys.toLocaleString('fr-FR')}</p>
            <p>Nb d'occupants moyen par véhicule :${features[0].properties.occupation_rate.toLocaleString('fr-FR')}</p>
          </div>`
        popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(this.$data[container])
      })
      this.$data[container].on('mouseleave', 'occupationLayer', () => {
        this.$data[container].getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }

  public selectedMap(){
    if (this.map === 'metropole'){
      this.$emit('rerenderMap', 'droms')
    } else {
      this.$emit('rerenderMap', 'metropole')
    }
  }

  public async test() {
    if(this.type === "com"){
      for (let territory of this.territories){
        this.$data['map_'+territory.name].addLayer({
          'id': 'decoupage-com',
          'type': 'line',
          'source': 'decoupageSource',
          'source-layer': 'communes',
          'paint': {
          'line-color': '#ff69b4',
          'line-width': 1
          }
        })
      }
    } else if (this.type === "dep"){
      for (let territory of this.territories){
        this.$data['map_'+territory.name].addLayer({
          'id': 'decoupage-dep',
          'type': 'line',
          'source': 'decoupageSource',
          'source-layer': 'departements',
          'paint': {
          'line-color': '#ff69b4',
          'line-width': 1
          }
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.content{
  position: absolute;
  top: 107px;
  bottom: 0;
  width: 100%;
  @media screen and (min-width: 992px) {
    top: 185px;
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