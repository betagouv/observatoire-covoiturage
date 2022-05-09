<template>
  <div class="map_container">
    <div id="map"></div>
    <Legend :title="legendTitleJourneys" :analyzes="categories" type="proportional_circles" class="upper_legend"/>
    <Legend :title="legendTitleOccupation" :analyzes="analyse" type="interval"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { OccupData } from '../../interfaces/maps'
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'
import Legend from './helpers/legend.vue'

@Component({
  components:{
    Legend,
  }
})
export default class Occupation extends mixins(MapMixin){
  @Prop({ required: true }) period!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: TerritoryInterface
  type='com'
  map:any = null
  data:Array<OccupData> = []
  categories=[
    {color:[229, 229, 224],val:'>= 100 000',width:40,active:true},
    {color:[229, 229, 224],val:'10 000',width:20,active:true},
    {color:[229, 229, 224],val:'100',width:10,active:true},
    {color:[229, 229, 224],val:'10',width:5,active:true}
  ]
  analyse=[
    {color:[229, 229, 244],val:2,width:10,active:true},
    {color:[154, 154, 255],val:2.25,width:10,active:true},
    {color:[127, 127, 200],val:2.5,width:10,active:true},
    {color:[0, 0, 145],val:2.75,width:10,active:true},
    {color:[0, 0, 116],val:3,width:10,active:true},
    {color:[0, 0, 109],val:4,width:10,active:true},
  ]
  legendTitleOccupation="Taux d'occupation des véhicules partagés"

  get filteredData(){
    if(this.data){
      return turf.featureCollection(this.data.map(d => turf.feature(d.geom,{
        territory:d.territory,
        l_territory:d.l_territory,
        journeys:d.journeys,
        occupation_rate:d.occupation_rate
      })))
    }else{
      return undefined
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
    return "Nombre de véhicules partagés par "+this.$store.state.helpers.territories.find(t => t.type === this.type).name.toLowerCase() 
  }

  @Watch('territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    this.map.getSource('occupationSource').setData(this.filteredData)
    const bounds = bbox(this.filteredData)
    this.map.fitBounds(bounds, {padding: 50})
  }

  public async mounted() {
    await this.getData()
    await this.createMap('map')
    await this.addLayers()
  }

  public async getData(){
    const response = await this.$axios.get(`/journeys_monthly_occupation?code=${this.territory.territory}&t=${this.type}&t2=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    this.data = response.data
  }

  public addLayers() {
    this.map.on('style.load', () => {
      this.map.addSource('occupationSource', {
        type: 'geojson',
        data: this.filteredData
      })
      this.map.addLayer({
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
      if(this.territory.territory !== 'XXXXX'){
        const bounds = bbox(this.filteredData)
        this.map.fitBounds(bounds, {padding: 20})
      }

      let popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false
      })
      this.map.on('mouseenter', 'occupationLayer', e => {
        let features = this.map.queryRenderedFeatures(e.point)
        this.map.getCanvas().style.cursor = 'pointer'
        if(features[0].properties){
          let description = `
          <div class="popup">
            <p><b>${features[0].properties.l_territory}</b></p>
            <p>Véhicules partagés :${features[0].properties.journeys.toLocaleString('fr-FR')}</p>
            <p>Nb de personnes par véhicule en moyenne :${features[0].properties.occupation_rate.toLocaleString('fr-FR')}</p>
          </div>`
          popup.setLngLat(e.lngLat)
          .setHTML(description)
          .addTo(this.map)
        }
      })
      this.map.on('mouseleave', 'occupationLayer', () => {
        this.map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }
}
</script>
<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.o-tabs__content{
  padding: 0 !important;
}
.map_container {
  height: 500px;
  #map{
    position:relative;
    height: 100%;
  }
}
</style>
