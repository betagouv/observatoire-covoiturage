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
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import {MapboxLayer} from '@deck.gl/mapbox';
import { ArcLayer } from '@deck.gl/layers'
import { WebMercatorViewport } from '@deck.gl/core';
import { Deck } from '@deck.gl/core'
import { MonthlyPeriodInterface, TerritoryInterface } from '../../interfaces/sidebar'
import Legend from './helpers/legend.vue'

interface FluxData {
  ter_1:string,
  lng_1:number,
  lat_1:number,
  ter_2:string,
  lng_2:number,
  lat_2:number,
  passengers:number,
  distance:number,
}
interface Analyse {val:number,color:[number, number, number],width:number}

@Component({
  components:{
    Legend,
  }
})
export default class Flux extends mixins(MapMixin){
  @Prop({ required: true }) period!: MonthlyPeriodInterface
  @Prop({ required: true }) territory!: TerritoryInterface
  map:any = null
  deck:any = null
  data:Array<FluxData> = []
  filteredData:Array<FluxData>=[]
  analyse:Array<Analyse> = []
  slider:Array<number>=[]
  type='com'
  legendTitle="Aires de covoiturage (source transport.data.gouv.fr)"

  

  @Watch('territory', { deep: true })
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
    const response = await this.$axios.get(`/passengers_monthly_flux?code=${this.territory.territory}&t=${this.type}&t2=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    this.data = response.data
    //this.slider = this.defaultSlider('passengers')
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
    })
  }

  public addLayers() {
    const deck = this.deck
    this.map.on('style.load', () => {
      this.map.addLayer(new MapboxLayer({id: 'flux-layer', deck}))
    })
  }
   public addArcLayer(){
    return new ArcLayer({
      id: 'flux-layer',
      data:this.data,
      opacity:0.4,
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
        fontSize: '0.8em',
        width:'250px',
        height:'110px',
        left:'-125px',
        top:'-110px'
      }
    }
  }

  public defaultSlider(field:string){
    if(this.data){
      const values = this.data!.map((d:FluxData) => d[field])
      return [10,Math.max(...values)]
    }else{
      return []
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
    const coords = this.data.map(d => {return [[d.lng_1,d.lat_1],[d.lng_2,d.lat_2]]})
      .reduce((acc, val) => acc.concat(val), [])
    return bbox(turf.multiPoint(coords))

  }
}
</script>
<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.o-tabs__content{
  padding: 0 !important;
}
.mapping {
  height: 500px;
}
.map_container{
  position:relative;
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  :focus, :focus-visible {
    z-index: auto;
  }
}
.map_container > * {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .deck{
    z-index: 1;
  }
}

</style>
