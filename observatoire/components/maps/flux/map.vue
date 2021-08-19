<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <MapsFluxSidebar 
        v-if="flux" 
        :value.sync="slider" 
        :time="time"
        :type.sync="type" 
        :sliderOptions="{'min':0,'max':this.defaultSlider('journeys')[1],'step':1}"
        :journeys="allJourneys"
      />
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
            <canvas id="deck_metropole" class="deck"></canvas>
          </div>
          <MapsHelpersLegend :title="legendTitle" :analyzes="analyse" type="interval"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <MapsHelpersLegend v-if="map ==='droms'" :title="legendTitle" :analyzes="analyse" type="interval"/>
          <div class="map_container">
            <div id="map_antilles"></div>
            <canvas id="deck_antilles" class="deck"></canvas>
          </div>
          <div class="map_container">
            <div id="map_guyane"></div>
            <canvas id="deck_guyane" class="deck"></canvas>
          </div>
          <div class="map_container">
            <div id="map_mayotte"></div>
            <canvas id="deck_mayotte" class="deck"></canvas>
          </div>
          <div class="map_container">
            <div id="map_reunion"></div>
            <canvas id="deck_reunion" class="deck"></canvas>
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
import {ArcLayer} from '@deck.gl/layers'
import axios from 'axios'

interface FluxData {
  com1:string,
  l_com1:string,
  com1_lng:number,
  com1_lat:number,
  com2:string,
  l_com2:string,
  com2_lng:number,
  com2_lat:number,
  journeys:number,
  passengers:number
}

@Component
export default class FluxMap extends mixins(BreakpointsMixin,MapsMixin){
  @Prop({ required: true }) map!: string

  map_metropole=null
  map_antilles=null
  map_guyane=null
  map_mayotte=null
  map_reunion=null
  deck_metropole=null
  deck_antilles=null
  deck_guyane=null
  deck_mayotte=null
  deck_reunion=null
  type='com'
  flux:Array<FluxData>=[]
  filteredFlux:Array<FluxData>=this.flux
  time:{year:string,month:string}={
    year:'',
    month:''
  }
  analyse:Array<{val:number,color:RegExpMatchArray | Array<number>,width:number}> = []
  slider:Array<number>=[]
  loading=true
  $buefy:any

  get allJourneys(){
    if(this.filteredFlux){
      return this.filteredFlux.map((f: { journeys: any })=>f.journeys).reduce((a: any, b: any) => a + b, 0).toLocaleString('fr-FR')
    } else{
      return 0
    }
  }

  get legendTitle(){
    return "Nb de trajets entre "+this.$store.state.helpers.territories.find(t => t.type === this.type).name.toLowerCase()+" (source RPC)" 
  }

  public async created() {
    await this.getTime()
    await this.getData()
  }
  
  public async mounted(){
    await this.renderMaps()
    await this.renderDecks()
  }

  @Watch('flux', { deep: true })
  onFluxChanged() {
    this.jenksAnalyse()
  }

  @Watch('slider')
  onSliderChanged() {
    this.filterFlux('journeys')
  }
  
  @Watch('time', { deep: true })
  onTimeChanged() {
    this.getData()
  }

  @Watch('type')
  onTypeChanged() {
    this.getData()
  }

  @Watch('screen.window', { deep: true })
  onWindowChanged() {
    for (let territory of this.territories) {
      if(this.$data['deck_'+territory.name]){
        this.$data['deck_'+territory.name].setProps({
          ...this.$data['deck_'+territory.name].props,
          width: "100%",
          height: "100%",
        })
      }
    }
  }

  public async getTime(){
    const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
    this.time = response.data 
  }

  public async getData(){
    try{
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/journeys_monthly_flux?t='+this.type+'&year='+this.time.year+'&month='+this.time.month)
      if(response.status === 204){
          this.$buefy.snackbar.open({
          message: response.data.message,
          actionText:null
        })
      }
      if(response.status === 200){
        this.flux = response.data
        this.slider = this.defaultSlider('journeys')
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

  public jenksAnalyse(){
   if(this.type !== 'country'){ 
    this.analyse = this.jenks(this.flux!,'journeys',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.flux!,'journeys',['#000091','#000091','#000091'],[3,12,48])
   }
  }

  public async renderMaps() {
    if (this.map === 'metropole'){ 
      this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map)!)
    } else if(this.map === 'droms'){
      for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
        this.createMap('map_'+territory.name,territory)
      }
    } else {
      for (let territory of this.territories) {
        this.createMap('map_'+territory.name,territory)
      }
    }
  }

  public async renderDecks() {
    if (this.map === 'metropole'){ 
      this.createDeck('deck_'+this.map,this.territories.find(t => t.name === this.map)!,this.addArcLayer())
    } else if(this.map === 'droms'){
      for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
        this.createDeck('deck_'+territory.name,territory,this.addArcLayer())
      }
    } else {
      for (let territory of this.territories) {
        this.createDeck('deck_'+territory.name,territory,this.addArcLayer())
      }
    }
  }

  public addArcLayer(){
    return new ArcLayer({
      id: 'flux-layer',
      data:this.filteredFlux,
      opacity:0.4,
      pickable: true,
      getWidth: (d:any) => this.classWidth( d.journeys,this.analyse)!,
      getSourcePosition: (d:any) => [d.territory_1_lng,d.territory_1_lat],
      getTargetPosition: (d:any) => [d.territory_2_lng,d.territory_2_lat],
      getSourceColor: [0,0,145],
      getTargetColor:  [0,0,145],
    })
  }

  public defaultSlider(field:string){
    if(this.flux){
      const values = this.flux!.map((d:FluxData) => d[field])
      return [10,Math.max(...values)]
    }else{
      return []
    }
  }

  public async filterFlux(field:string){
    if(this.flux){
      this.filteredFlux = this.flux.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    for (let territory of this.territories) {
      if(this.$data['deck_'+territory.name]){
        this.$data['deck_'+territory.name].setProps({layers:[this.addArcLayer()]})
      }
    }
  }

  public selectedMap(event:any){
    this.$emit('rerenderMap', event)
  }
}
</script>

<style lang="scss" scoped>
.content{
  position: absolute;
  top: 105px;
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
}
</style>