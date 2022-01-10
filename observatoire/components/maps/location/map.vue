<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
            <canvas id="deck_metropole" class="deck"></canvas>
          </div>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
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
import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { $axios } from '../../../utils/api'
//import Sidebar from './sidebar.vue'
//import Legend from '../helpers/legend.vue'
import Controls from '../helpers/controls.vue'

interface LocationData {
  hex:string,
  count:number,
}

interface Time {year:string,month:string}

@Component({
  components:{Controls}
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
  data:Array<LocationData>=[]
  //filteredFlux:Array<FluxData>=[]
  time:Time={
    year:'',
    month:''
  }
  analyse:Array<{val:number,color:RegExpMatchArray | Array<number>,width:number}> = []
  slider:Array<number>=[]
  loading=true
  $buefy:any

  /*get allPassengers(){
    if(this.filteredFlux){
      return this.filteredFlux.map(f=>f.passengers).reduce((a, b) => a + b, 0).toLocaleString('fr-FR')
    } else{
      return 0
    }
  }*/

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

  /*@Watch('slider')
  onSliderChanged() {
    this.filterFlux('passengers')
  }*/
  
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
        const response = await $axios.get(`/location?date_1=2021-11-01&date_2=2021-12-01`)
        if(response.status === 204){
            this.$buefy.snackbar.open({
            message: response.data.message,
            actionText:null
          })
        }
        if(response.status === 200){
          this.data = response.data
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
    this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091','#000091','#000091','#000091'],[1,3,6,12,24,48])
   } else {
     this.analyse = this.jenks(this.data!,'passengers',['#000091','#000091','#000091'],[3,12,48])
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
          await this.createDeck(`deck_${this.map}`,this.territories.find(t => t.name === this.map)!,this.addHexLayer())
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
          await this.createDeck(`deck_${territory.name}`,territory,this.addHexLayer())
          }
        } else {
          for (let territory of this.territories) {
          await  this.createDeck(`deck_${territory.name}`,territory,this.addHexLayer())
          }
        }
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public addHexLayer(){
    return new H3HexagonLayer({
      id: 'flux-layer',
      data:this.data,
      opacity:0.4,
      filled: true,
      extruded: false,
      getHexagon: d => d.hex,
      getFillColor: d => [255, (1 - d.count / 500) * 255, 0],
      getLineColor: d => [0, 0, 0],
      lineWidthMinPixels: 1,
      getLineWidth: 1
    })
  }

  public defaultSlider(field:string){
    if(this.data){
      const values = this.data!.map((d:LocationData) => d[field])
      return [10,Math.max(...values)]
    }else{
      return []
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