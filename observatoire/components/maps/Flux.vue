<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="flux" 
        v-model="slider" 
        :time="time"
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
          <Legend :title="legendTitle" :analyzes="jenksJourneys" type="interval"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <Legend v-if="map ==='droms'" :title="legendTitle" :analyzes="jenksJourneys" type="interval"/>
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
        <Controls :map="map" @selectedMap="selectedMap"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Prop } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../components/mixins/breakpoints'
import MapsMixin from '../../components/mixins/maps'
import {ArcLayer} from '@deck.gl/layers'


@Component
export default class Header extends mixins(BreakpointsMixin,MapsMixin){
  @Prop({ required: true }) map: string

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
  flux=null
  filteredFlux=this.flux
  time=null
  slider=[]
  loading=true
  legendTitle="Nb de trajets entre communes (source RPC)"
  
  get jenksJourneys(){
    if(this.flux){
      return this.jenks(this.flux,'journeys',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
    }else{
      return []
    }
  }

  get allJourneys(){
    if(this.filteredFlux){
      return this.filteredFlux.map((f: { journeys: any })=>f.journeys).reduce((a: any, b: any) => a + b, 0).toLocaleString('fr-FR')
    } else{
      return 0
    }
  }

  public mounted() {
    this.handleResize()
  }


  public async getTime({$axios}){
    const response = await $axios.get('http://localhost:8080/v1/journeys_monthly_flux/last')
    this.time = response.data 
  }

  public async getData({$axios,$buefy}){
    try{
      this.loading = true
      const response = await $axios.get('http://localhost:8080/v1/journeys_monthly_flux?year='+this.time.year+'&month='+this.time.month)
      if(response.status === 204){
          $buefy.snackbar.open({
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
      $buefy.snackbar.open({
        message: error.response.data.message,
        actionText:null
      })
      this.loading = false
    }
  }

  public async renderMaps() {
    if (this.map === 'metropole'){ 
      this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map))
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
      this.createDeck('deck_'+this.map,this.territories.find(t => t.name === this.map),this.addArcLayer())
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
      getWidth: (d: { journeys: number }) => this.classWidth( d.journeys,this.jenksJourneys),
      getSourcePosition: (d: { com1_lng: number; com1_lat: number }) => [d.com1_lng,d.com1_lat],
      getTargetPosition: (d: { com2_lng: number; com2_lat: number }) => [d.com2_lng,d.com2_lat],
      getSourceColor: [0,0,145],
      getTargetColor:  [0,0,145],
    })
  }

  public defaultSlider(field:string){
    if(this.flux){
      const values = this.flux!.map((d: any) => d[field])
      return [Math.min(...values),Math.max(...values)]
    }else{
      return []
    }
  }

  public async filterFlux(field:string){
    this.filteredFlux = this.flux.filter((d: any) => d[field] >= this.slider[0] && d[field] <= this.slider[1]) || []
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
    top: 130px;
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