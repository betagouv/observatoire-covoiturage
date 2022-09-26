<template>
<div class="fr-grid-row">
  <div class="fr-col mapping">
    <div class="map_container">
      <o-loading :active.sync="isLoading">
        <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
      </o-loading>
      <div id="map"></div>
      <Legend :title="legendTitleJourneys" :analyzes="categories" :def="def_urlJourneys" :amount="amount" type="proportional_circles" class="upper_legend"/>
      <Legend :title="legendTitleOccupation" :analyzes="analyse" :def="def_urlOccupation" type="interval"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { OccupData } from '../../interfaces/maps'


@Component
export default class Occupation extends mixins(MapMixin){
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
  mapTitle="Taux d'occupation des véhicules partagés et volume de ces véhicules par territoire (source: RPC)"
  legendTitleOccupation="Taux d'occupation des véhicules partagés (source: RPC)"
  def_urlJourneys="/pages/glossaire/#passager"
  def_urlOccupation="/pages/glossaire/#occupation"

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
  
  get amount(){
    let count = '0'
    if(this.filteredData){
      count = this.filteredData.features.map(f=>f.properties.journeys).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
    }
    return `${count} véhicules partagés selon les critères sélectionnés`
  }

  get legendTitleJourneys(){
    return "Nombre de véhicules partagés par "+this.$store.state.helpers.territories.find(t => t.type === this.dashboard.selectedOccupationType).name.toLowerCase() 
  }

  @Watch('dashboard.period', { deep: true })
  async onPeriodChanged() {
    await this.refreshMap()
  }

  @Watch('dashboard.territory', { deep: true })
  async onTerritoryChanged() {
    await this.refreshMap()
  }

  @Watch('dashboard.selectedOccupationType')
  async onFluxTypeChanged() {
    await this.getData()
    await this.refreshMap()
  }  

  public async mounted() {
    await this.getData()
    await this.createMap('map')
    await this.addLayers()
    this.$store.commit('dashboard/REF_GLOSSARY', this.def_urlOccupation)
  }

  public async getData(){
    try{
      this.isLoading = true
      const response = await this.$axios.get(`/journeys_monthly_occupation?code=${this.dashboard.territory.territory}&t=${this.dashboard.selectedOccupationType}&t2=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
      if(response.status === 204){
        this.$oruga.notification.open({
          message: response.data.message,
        })
      }
      if(response.status === 200){
        this.data = response.data
      }
      this.isLoading = false
    }
    catch(error:any) {
      this.$oruga.notification.open({
        message: error.response.data.message,
      })
      this.isLoading = false
    }
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
      if(this.dashboard.territory.territory !== 'XXXXX'){
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
            <p>Véhicules partagés : ${features[0].properties.journeys.toLocaleString('fr-FR')}</p>
            <p>Nb de personnes par véhicule en moyenne : ${features[0].properties.occupation_rate.toLocaleString('fr-FR')}</p>
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
   public async refreshMap() {
    await this.getData()
    this.map.getSource('occupationSource').setData(this.filteredData)
    const bounds = this.dashboard.territory.territory == 'XXXXX' ? [-5.225,41.333,9.55,51.2] : bbox(this.filteredData)
    this.map.fitBounds(bounds, {padding: 50})
  }
}
</script>
