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
import bbox from '@turf/bbox'
import { DensiteData, MapAnalyseInterface } from '../../interfaces/maps'
import { MapboxLayer } from '@deck.gl/mapbox';
import { ArcLayer } from '@deck.gl/layers'
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
  map:Deck = null
  deck:Deck = null
  data:Array<DensiteData> = []
  filteredData:Array<DensiteData>=[]
  analyse:Array<MapAnalyseInterface> = []
  zoom=8
  slider:Array<number>=[]
  type='com'
  legendTitle="Flux de covoiturage (source transport.data.gouv.fr)"

  public async created(){
    await this.$store.dispatch('dashboard/getDensitePeriod')
  }

  @Watch('dashboard.period', { deep: true })
  async onPeriodChanged() {
    await this.getData()
    const bounds = this.getBbox()
    this.map.fitBounds(bounds, {padding: 50})
    this.deck.setProps({layers:[this.addArcLayer()]})
  }

  @Watch('dashboard.territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    const bounds = this.getBbox()
    this.map.fitBounds(bounds, {padding: 50})
    this.deck.setProps({layers:[this.addArcLayer()]})
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
    await this.getData()
    await this.createMap('map')
    await this.createDeck( this.addArcLayer())
    this.addLayers()
  }

  public async getData(){
    const response = await this.$axios.get(`/location?date_1=${this.dashboard.densitePeriod.start.toISOString().slice(0, 10)}&date_2=${this.dashboard.densitePeriod.end.toISOString().slice(0, 10)}&zoom=${this.zoom}`)
    this.data = response.data
  }

  public filterData(field:string){
    if(this.data){
      this.filteredData = this.data.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    this.deck.setProps({layers:[this.addArcLayer()]})
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
   public addArcLayer(){
    return new ArcLayer({
      id: 'flux-layer',
      data:this.data,
      opacity:0.3,
      pickable: true,
      getWidth: (d:any) => this.classWidth( d.passengers,this.analyse)!,
      getSourcePosition: (d:any) => [d.lng_1,d.lat_1],
      getTargetPosition: (d:any) => [d.lng_2,d.lat_2],
      getSourceColor: [0,0,145],
      getTargetColor:  [0,0,145],
    })
  }

  public addTooltip(){
    return ({object}) => object && {
      html: `<div class="tooltip-title"><b>${object.ter_1} - ${object.ter_2}</b></div>
      <div>${object.passengers} passagers transportés</div>
      <div>${object.distance.toLocaleString()} Km parcourus</div>`,
      className:'fr-callout',
      style: {
        color:'#000',
        backgroundColor: '#fff',
        fontSize: '1.1em',
        width:'250px',
        height:'110px',
        left:'-125px',
        top:'-110px'
      }
    }
  }

  public jenksAnalyse(){
   if(this.type !== 'country' ){ 
    this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091'],[3,12,48])
   }
  }

  public getBbox(){
    const hexagons = this.data.map(d => {return d.hex})
      .reduce((acc, val) => acc.concat(val), [])
    const polygon = h3SetToMultiPolygon(hexagons, true)
    return bbox(polygon)
  }
}
</script>

