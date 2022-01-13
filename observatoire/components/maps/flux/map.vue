<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="flux" 
        :value.sync="slider" 
        :time="time"
        :type.sync="type" 
        :sliderOptions="{'min':0,'max':this.defaultSlider('passengers')[1],'step':1}"
        :passengers="allPassengers"
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
          <Legend :title="legendTitle" :analyzes="analyse" type="interval"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <Legend v-if="map ==='droms'" :title="legendTitle" :analyzes="analyse" type="interval"/>
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
import { Component,mixins,Prop,Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import MapsMixin from '../../mixins/maps'
import {ArcLayer} from '@deck.gl/layers'
import { $axios } from '../../../utils/api'
import Sidebar from './sidebar.vue'
import Legend from '../helpers/legend.vue'
import Controls from '../helpers/controls.vue'

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

interface Time {year:string,month:string}

@Component({
  components:{Sidebar, Legend, Controls}
})
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
  filteredFlux:Array<FluxData>=[]
  time:Time={
    year:'',
    month:''
  }
  analyse:Array<{val:number,color:RegExpMatchArray | Array<number>,width:number}> = []
  slider:Array<number>=[]
  loading=true
  $buefy:any

  get allPassengers(){
    if(this.filteredFlux){
      return this.filteredFlux.map(f=>f.passengers).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
    } else{
      return 0
    }
  }

  get legendTitle(){
    return `Nb de passagers transportés entre ${this.$store.state.helpers.territories.find(t => t.type === this.type).name.toLowerCase()} (source RPC)` 
  }
  
  public async mounted(){
    await this.getTime()
    await this.getData()
    await this.renderMaps()
    await this.renderDecks()
  }

  @Watch('flux', { deep: true })
  onFluxChanged() {
    this.jenksAnalyse()
  }

  @Watch('slider')
  onSliderChanged() {
    this.filterFlux('passengers')
  }
  
  @Watch('time', { deep: true })
  async onTimeChanged(val:Time, oldval:Time) {
    if (oldval.year !== '' || oldval.month !== ''){
      await this.getData()
    }
  }

  @Watch('type')
  async onTypeChanged() {
    await this.getData()
  }

  @Watch('screen.window', { deep: true })
  onWindowChanged() {
    for (let territory of this.territories) {
      if(this.$data[`deck_${territory.name}`]){
        this.$data[`deck_${territory.name}`].setProps({
          ...this.$data[`deck_${territory.name}`].props,
          width: "100%",
          height: "100%",
        })
      }
    }
  }

  public getTime(){
    return new Promise<void>(async (resolve, reject) => {
      try{
        const response = await $axios.get('/monthly_flux/last')
        this.time = response.data
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public getData(){
    return new Promise<void>(async (resolve, reject) => {
      try{
        this.loading = true
        const response = await $axios.get(`/passengers_monthly_flux?t=${this.type}&year=${this.time.year}&month=${this.time.month}`)
        if(response.status === 204){
            this.$buefy.snackbar.open({
            message: response.data.message,
            actionText:null
          })
        }
        if(response.status === 200){
          this.flux = response.data
          this.slider = this.defaultSlider('passengers')
        }
        this.loading = false
        resolve()
      }
      catch(error) {
        this.$buefy.snackbar.open({
          message: error.response.data.message,
          actionText:null
        })
        this.loading = false
        reject(error)
      }
    })
  }

  public jenksAnalyse(){
   if(this.type !== 'country' ){ 
    this.analyse = this.jenks(this.flux!,'passengers',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.flux!,'passengers',['#000091','#000091','#000091'],[3,12,48])
   }
  }

  public renderMaps() {
    return new Promise<void>(async(resolve, reject) => {
      try{
        if (this.map === 'metropole'){ 
          await this.createMap(`map_${this.map}`,this.territories.find(t => t.name === this.map)!)
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
            await this.createMap(`map_${territory.name}`,territory)
          }
        } else {
          for (let territory of this.territories) {
            await this.createMap(`map_${territory.name}`,territory)
          }
        }
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public renderDecks() {
    return new Promise<void>(async(resolve, reject) => {
      try{
        if (this.map === 'metropole'){ 
          await this.createDeck(`deck_${this.map}`,this.territories.find(t => t.name === this.map)!,this.addArcLayer())
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
          await this.createDeck(`deck_${territory.name}`,territory,this.addArcLayer())
          }
        } else {
          for (let territory of this.territories) {
          await  this.createDeck(`deck_${territory.name}`,territory,this.addArcLayer())
          }
        }
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public addArcLayer(){
    return new ArcLayer({
      id: 'flux-layer',
      data:this.filteredFlux,
      opacity:0.4,
      pickable: true,
      getWidth: (d:any) => this.classWidth( d.passengers,this.analyse)!,
      getSourcePosition: (d:any) => [d.lng_1,d.lat_1],
      getTargetPosition: (d:any) => [d.lng_2,d.lat_2],
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

  public filterFlux(field:string){
    if(this.flux){
      this.filteredFlux = this.flux.filter(d => d[field] >= this.slider[0] && d[field] <= this.slider[1])
    }
    for (let territory of this.territories) {
      if(this.$data[`deck_${territory.name}`]){
        this.$data[`deck_${territory.name}`].setProps({layers:[this.addArcLayer()]})
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