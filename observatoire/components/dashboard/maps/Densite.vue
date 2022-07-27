<template>
<div class="fr-grid-row">
  <div class="fr-col mapping">
    <div class="map_container">
      <div id="map"></div>
      <Legend :title="legendTitle" :analyzes="analyse" type="interval"/>
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
import { DensiteData, MapAnalyseInterface } from '../../interfaces/maps'
import { MapboxLayer } from '@deck.gl/mapbox';
import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { Deck } from '@deck.gl/core'
import Legend from './helpers/legend.vue'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'

@Component({
  components:{
    Legend,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Densite extends mixins(MapMixin){
  dashboard!: DashboardState
  map:any = null
  deck:any = null
  data:Array<DensiteData> = []
  filteredData:Array<DensiteData>=[]
  analyse:Array<MapAnalyseInterface> = []
  zoom=8
  slider:Array<number>=[]
  type='com'
  legendTitle="Flux de covoiturage (source transport.data.gouv.fr)"

  @Watch('dashboard.period', { deep: true })
  async onPeriodChanged() {
    await this.changeDensitePeriod()
    await this.getData()
    this.updateLayer()
  }

  /*@Watch('dashboard.densitePeriod', { deep: true })
  async ondensitePeriodChanged() {
    await this.getData()
    this.updateLayer()
  }*/

  @Watch('dashboard.territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    this.updateLayer()
  }

  @Watch('data', { deep: true })
  onFluxChanged() {
    this.jenksAnalyse()
  }

  @Watch('slider')
  onSliderChanged() {
    this.filterData('passengers')
  }

  public async mounted() {
    await this.$store.dispatch('dashboard/getDensitePeriod')
    await this.getData()
    await this.createMap('map')
    await this.createDeck( this.addHexLayer())
    this.addLayers()
  }

  public async getData(){
    const response = await this.$axios.get(`/location?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}&date_1=${this.dashboard.densitePeriod.start.toISOString().slice(0, 10)}&date_2=${this.dashboard.densitePeriod.end.toISOString().slice(0, 10)}&zoom=${this.zoom}`)
    this.data = response.data
  }

  public filterData(field:string){
    if(this.data){
      this.filteredData = this.data.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    this.deck.setProps({layers:[this.addHexLayer()]})
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

  public jenksAnalyse(){
    this.analyse = this.jenks(this.data,'count',['#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000','#000000'],[10,10,10,10,10,10])
  }

  public getBbox(){
    const hexagons = this.data.map(d => {return d.hex})
    const polygon = h3SetToMultiPolygon(hexagons, true)
    return bbox(turf.multiPolygon(polygon))
  }

  public updateLayer(){
    if(this.map && this.deck){
      this.map.fitBounds(this.getBbox(), {padding: 50})
      this.deck.setProps({layers:[this.addHexLayer()]})
    }
  }

  public async changeDensitePeriod(){
    
    const period = { 
      start: new Date(Number(this.dashboard.period.year),Number(this.dashboard.period.month)-1,2),
      end: new Date(Number(this.dashboard.period.year),Number(this.dashboard.period.month),0)
    }
    this.$store.commit('dashboard/DENSITE_PERIOD',period)
  }
}
</script>

