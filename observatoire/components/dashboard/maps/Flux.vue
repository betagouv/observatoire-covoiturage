<template>
<div class="container">
  <div class="map_container">
    <div id="map"></div>
    <canvas id="deck" class="deck"></canvas>
    <Legend :title="legendTitle" :analyzes="analyse" type="interval"/>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { ArcLayer } from '@deck.gl/layers'
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
  legendTitle="Aires de covoiturage (source transport.data.gouv.fr)"

  

  @Watch('territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    //this.map.getSource('fluxSource').setData(this.data)
    //const bounds = bbox(this.data)
    //this.map.fitBounds(bounds, {padding: 50})
  }

  @Watch('data', { deep: true })
  onFluxChanged() {
    this.jenksAnalyse()
  }

  @Watch('screen.window', { deep: true })
  onWindowChanged() {
    this.deck.setProps({
      ...this.deck.props,
      width: "100%",
      height: "100%",
    })
  }

  public async mounted() {
    await this.getData()
    await this.createMap('map')
    await this.createDeck('deck', this.addArcLayer(), this.addTooltip())
  }

  public async getData(){
    const response = await this.$axios.get(`/passengers_monthly_flux?code=${this.territory.territory}&t=${this.territory.type}&year=${this.period.year}&month=${this.period.month}`)
    this.data = response.data
  }

  public filterData(field:string){
    if(this.data){
      this.filteredData = this.data.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    this.deck.setProps({layers:[this.addArcLayer()]})
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
   if(this.territory.type !== 'country' ){ 
    this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091'],[3,12,48])
   }
  }
}
</script>
<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.o-tabs__content{
  padding: 0 !important;
}
.container {
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
