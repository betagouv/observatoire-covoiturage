<template>
<div class="fr-grid-row">
  <div class="fr-col mapping">
    <div class="map_container">
      <o-loading :active.sync="isLoading">
        <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
      </o-loading>
      <div id="map"></div>
      <Legend :title="legendTitle" :analyzes="analyse" :def=def_url type="interval" :amount="amount"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import { FluxData, MapAnalyseInterface } from '../../interfaces/maps'
import { MapboxLayer } from '@deck.gl/mapbox';
import { ArcLayer } from '@deck.gl/layers'
import { Deck } from '@deck.gl/core'

@Component
export default class Flux extends mixins(MapMixin){
  data:Array<FluxData> = []
  filteredData:Array<FluxData>=[]
  analyse:Array<MapAnalyseInterface> = []
  legendTitle="Flux mensuels de passagers entre territoires (source: RPC)"
  def_url="/pages/glossaire/#passager"


  get amount(){
    let count = '0'
    if(this.filteredData){
      count = this.filteredData.map(f=>f.passengers).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
    }
    return `${count} passagers transportés selon les critères sélectionnés`
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

  @Watch('dashboard.selectedFluxType')
  async onFluxTypeChanged() {
    await this.getData()
    const bounds = this.getBbox()
    this.map.fitBounds(bounds, {padding: 50})
    this.deck.setProps({layers:[this.addArcLayer()]})
  }  
 
  @Watch('dashboard.selectedFluxNb')
  onSliderChanged() {
    if(this.map && this.deck){
      this.filterData('passengers')
      this.deck.setProps({layers:[this.addArcLayer()]})
    }
  }

  public async mounted() {
    await this.getData()
    await this.filterData('passengers')
    await this.createMap('map')
    await this.createDeck( this.addArcLayer())
    this.addLayers()
    this.$store.commit('dashboard/REF_GLOSSARY', this.def_url)
  }

  public async getData(){
    try{
      this.isLoading = true
      const response = await this.$axios.get(`/passengers_monthly_flux?code=${this.dashboard.territory.territory}&t=${this.dashboard.selectedFluxType}&t2=${this.dashboard.territory.type}&year=${this.dashboard.period.year}&month=${this.dashboard.period.month}`)
      if(response.status === 204){
        this.$oruga.notification.open({
          message: response.data.message,
        })
      }
      if(response.status === 200){
        this.data = response.data
        this.$store.commit('dashboard/MAX_FLUX_NB', this.defaultSlider('passengers')[1])
        this.$store.commit('dashboard/SELECTED_FLUX_NB', this.defaultSlider('passengers'))
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

  async filterData(field:string){
    if(this.data){
      this.filteredData = this.data.filter(d => d[field] >= this.dashboard.selectedFluxNb[0] && d[field] <= this.dashboard.selectedFluxNb[1])
    }
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
      this.map.addLayer(new MapboxLayer({id: 'flux-layer', deck}))
    })
  }
  
  public addArcLayer(){
    return new ArcLayer({
      id: 'flux-layer',
      data:this.filteredData,
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

  public defaultSlider(field:string){
    if(this.data){
      const values = this.data!.map((d:FluxData) => d[field])
      return [10,Math.max(...values)]
    }else{
      return []
    }
  }

  public jenksAnalyse(){
   if(this.dashboard.selectedFluxType !== 'country' ){ 
    this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091'],[3,12,48])
   }
  }

  public getBbox(){
    const coords = this.data.map(d => {return [[d.lng_1,d.lat_1],[d.lng_2,d.lat_2]]})
      .reduce((acc, val) => acc.concat(val), [])
    const bounds = this.dashboard.territory.territory == 'XXXXX' ? [-5.225,41.333,9.55,51.2] : bbox(turf.multiPoint(coords))
    return bounds
  }
}
</script>

