<template>
<div class="fr-grid-row">
  <div class="fr-col mapping">
    <div class="map_container">
      <o-loading :active.sync="isLoading">
        <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
      </o-loading>
      <div id="map"></div>
      <Legend :title="legendTitle" :analyzes="analyse" :def="def_url" type="interval"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import { h3SetToMultiPolygon } from 'h3-js'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import { DensiteData,AiresData, MapAnalyseInterface } from '../../interfaces/maps'
import maplibregl from 'maplibre-gl'
import { MapboxLayer } from '@deck.gl/mapbox';
import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { Deck } from '@deck.gl/core'

@Component
export default class Densite extends mixins(MapMixin){
  data:Array<DensiteData> = []
  filteredData:Array<DensiteData>=[]
  aires:Array<AiresData> = []
  analyse:Array<MapAnalyseInterface> = []
  slider:Array<number>=[]
  type='com'
  legendTitle="Densité de trajets dans un maillage hexagonale (origine et destination) (source: RPC)"
  def_url="/pages/glossaire/#passager"

  get airesGeojson(){
    return turf.featureCollection(this.aires.map(d => turf.feature(d.geom,{
        id_lieu:d.id_lieu,
        com_lieu:d.com_lieu,
        type:d.type,
        date_maj: d.date_maj,
        nbre_pl:d.nbre_pl,
        nbre_pmr:d.nbre_pmr,
        duree:d.duree,
        horaires:d.horaires,
        proprio:d.proprio,
        lumiere:d.lumiere,
        comm:d.comm
      })))
  }

  get visibleAireLayer(){
    return this.dashboard.densiteAires ? 'visible' : 'none'
  }
  

  @Watch('dashboard.period', { deep: true })
  async onPeriodChanged() {
    await this.changeDensitePeriod()
    await this.getData()
    this.updateLayer()
  }

  @Watch('dashboard.densitePeriod', { deep: true })
  async ondensitePeriodChanged() {
    await this.getData()
    this.updateLayer()
  }

  @Watch('dashboard.territory', { deep: true })
  async onTerritoryChanged() {
    await this.getAires()
    await this.getData()
    this.updateLayer()
  }

   @Watch('dashboard.densiteZoom', { deep: true })
  async onZoomChanged() {
    await this.getData()
    this.deck.setProps({layers:[this.addHexLayer()]})
  }

  @Watch('data', { deep: true })
  onFluxChanged() {
    this.jenksAnalyse()
  }

  @Watch('dashboard.densiteAires')
  onLayerChanged() {
    if(this.map)
    this.map.setLayoutProperty('airesLayer', 'visibility', this.visibleAireLayer)
  }

  public async mounted() {
    await this.$store.dispatch('dashboard/getDensitePeriod')
    await this.getAires()
    await this.getData()
    await this.createMap('map')
    await this.createDeck( this.addHexLayer())
    this.addLayers()
    this.$store.commit('dashboard/REF_GLOSSARY', this.def_url)
  }

  public async getData(){
    try{
      this.isLoading = true
      const response = await this.$axios.get(`/location?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&date_1=${this.dashboard.densitePeriod.start.toISOString().slice(0, 10)}&date_2=${this.dashboard.densitePeriod.end.toISOString().slice(0, 10)}&zoom=${this.dashboard.densiteZoom}`)
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

  public filterData(field:string){
    if(this.data){
      this.filteredData = this.data.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    this.deck.setProps({layers:[this.addHexLayer()]})
  }

  public async getAires(){
    const response = await this.$axios.get(`/aires_covoiturage?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}`)
    this.aires = response.data
  }

  async createDeck( layer:any, ) {
    this.deck = new Deck({
      gl: this.map.painter.context.gl,
      onHover: ({object}) => (this.isHovering = Boolean(object)),
      getCursor: ({isDragging}) => (isDragging ? 'grabbing' : (this.isHovering ? 'pointer' : 'grab')),
      layers:[layer],
      getTooltip:this.addTooltip()
    })
  }

  public addLayers() {
    const deck = this.deck
    this.map.on('style.load', () => {
      this.addAiresLayer()
      this.map.addLayer(new MapboxLayer({id: 'densite-layer', deck}))
      
    })
  }

  public addHexLayer(){
    return new H3HexagonLayer({
      id: 'densite-layer',
      data:this.data,
      opacity:0.4,
      pickable: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getHexagon: d => d.hex,
      getFillColor: d => this.classColor(d.count,this.analyse),
      getLineColor: d => [80, 80, 80],
    })
  }

  public addTooltip(){
    return ({object}) => object && {
      html: `<div><b>${object.count.toLocaleString()}</b> départ(s) ou arrivée(s) de covoiturage dans cette maille hexagonale</div>`,
      className:'fr-callout',
      style: {
        color:'#000',
        backgroundColor: '#fff',
        fontSize: '0.8em',
        width:'250px',
        height:'80px',
        left:'-125px',
        top:'-110px'
      }
    }
  }

  public addAiresLayer(){
    this.map.addSource('airesSource', {
      type: 'geojson',
      data: this.airesGeojson
    })
    this.map.addLayer({
      id: 'airesLayer',
      type: 'circle',
      source: 'airesSource',
      paint: {
        'circle-radius': {
          'base': 3,
          'stops': [
          [5, 3],
          [10,10],
          [15,15],
          [22, 50]
          ]
        },   
        'circle-color': [
        'match',
        ['get', 'type'],
        'Supermarché','#66c2a5',
        'Parking','#fc8d62',
        'Aire de covoiturage','#8da0cb',
        'Délaissé routier','#e78ac3',
        'Auto-stop','#a6d854',
        'Parking relais','#ffd92f',
        'Sortie d\'autoroute','#e5c494',
        /* other */ '#b3b3b3'
        ],
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.8
      }
    })
    let popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false
    })
    this.map.on('mouseenter', 'airesLayer', e => {
      let features = this.map.queryRenderedFeatures(e.point)
      this.map.getCanvas().style.cursor = 'pointer'
      let description = `
        <div class="fr-popup">
          <p><b>nom : </b>${features[0].properties.nom_lieu}</p>
          <p><b>commune : </b>${features[0].properties.com_lieu}</p>
          <p><b>type : </b>${features[0].properties.type}</p>
          <p><b>Places : </b>${features[0].properties.nbre_pl}</p>
          <p><b>Places pmr : </b>${features[0].properties.nbre_pmr}</p>
          <p><b>horaires : </b>${features[0].properties.horaires}</p>
          <p><b>Mise à jour : </b>${new Date(features[0].properties.date_maj).toLocaleDateString('fr-FR')}</p>
        </div>`
      popup.setLngLat(e.lngLat)
      .setHTML(description)
      .addTo(this.map)
    })
    this.map.on('mouseleave', 'airesLayer', () => {
      this.map.getCanvas().style.cursor = ''
      popup.remove()
    })
  }

  public jenksAnalyse(){
    this.analyse = this.jenks(this.data,'count',['#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000','#000000'],[10,10,10,10,10,10])
  }

  public getBbox(){
    const hexagons = this.data.map(d => {return d.hex})
    const polygon = h3SetToMultiPolygon(hexagons, true)
    const bounds = this.dashboard.territory.territory == 'XXXXX' ? [-5.225,41.333,9.55,51.2] : bbox(turf.multiPolygon(polygon))
    return bounds
  }

  public updateLayer(){
    if(this.map && this.deck){
      this.map.getSource('airesSource').setData(this.airesGeojson)
      this.map.fitBounds(this.getBbox(), {padding: 50})
      this.deck.setProps({layers:[this.addHexLayer()]})
    }
  }

  public async changeDensitePeriod(){
    await this.$store.dispatch('dashboard/getDensitePeriod')
  }
}
</script>

