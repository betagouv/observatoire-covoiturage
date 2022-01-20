<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="data" 
        :zoom.sync="zoom" 
        :time="time"
        :maxTime="time.end"
        :switchAires.sync="switchAires"
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
import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { $axios } from '../../../utils/api'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/helpers'
import Sidebar from './sidebar.vue'
import Legend from '../helpers/legend.vue'
import Controls from '../helpers/controls.vue'

interface DensiteData {
  hex:string,
  count:number,
}
interface AiresData {
  id_lieu:string,
  ad_lieu:string,
  com_lieu:string,
  type:string,
  date_maj: string,
  nbre_pl?:number,
  nbre_pmr?:number,
  duree?:number,
  horaires?:string,
  proprio?:string,
  lumiere?:boolean,
  comm?:string,
  geom:{properties:{ type:string,coordinates:[number,number]}}
}

interface Time {start:Date | null,end:Date | null}

interface Analyse {val:number,color:[number, number, number],width:number}

@Component({
  components:{Sidebar, Legend, Controls}
})
export default class DensiteMap extends mixins(BreakpointsMixin,MapsMixin){
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
  zoom=8
  data:Array<DensiteData>=[]
  aires:Array<AiresData>=[]
  switchAires='visible'
  time:Time={
    start:null,
    end:null
  }
  analyse:Array<Analyse> = []
  loading=true
  $buefy:any

 

  get legendTitle(){
    return `Densité de départ ou d'arrivée de covoiturage dans la maille hexagonale (source RPC)` 
  }
  public async mounted(){
    this.getAires()
    await this.getTime()
    await this.getData()
    await this.renderMaps()
    await this.renderDecks()
  }

  @Watch('data', { deep: true })
  onDataChanged() {
    this.jenksAnalyse()
  }
  
  @Watch('time', { deep: true })
  async onTimeChanged(val:Time, oldval:Time) {
    if ( oldval.end || oldval.start){
      await this.getData()
    }
  }

  @Watch('zoom')
  async onZoomChanged(val:number, oldval:number) {
    if ( oldval !== val){
      await this.getData()
    }
  }
  
  @Watch('analyse', { deep: true })
  async onAnalyseChanged(val:Array<Analyse>,oldval:Array<Analyse>) {
    if (oldval !== []){
      this.changeZoom()
    }
  }

  @Watch('switchAires')
  onAiresChanged(val:string, oldval:string) {
    if (oldval !== val){
      this.changeAires()
    }
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
        const response = await $axios.get('/rpc/last')
        this.time = { 
          start: new Date(new Date(response.data.date).setMonth(new Date(response.data.date).getMonth() - 1)),
          end: new Date(response.data.date)
        }
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
        if(this.time.start && this.time.end){
          const response = await $axios.get(`/location?date_1=${this.time.start.toLocaleDateString()}&date_2=${this.time.end.toLocaleDateString()}&zoom=${this.zoom}`)
          if(response.status === 204){
              this.$buefy.snackbar.open({
              message: response.data.message,
              actionText:null
            })
          }
          if(response.status === 200){
            this.data = response.data
          }
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

   public async getAires(){
    const response = await $axios.get('/aires_covoiturage')
    this.aires = response.data
  }

  public jenksAnalyse(){
    this.analyse = this.jenks(this.data,'count',['#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000','#000000'],[10,10,10,10,10,10])
  }

  public renderMaps() {
    return new Promise<void>(async(resolve, reject) => {
      try{
        if (this.map === 'metropole'){ 
          await this.createMap(`map_${this.map}`,this.territories.find(t => t.name === this.map)!)
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
            await this.createMap(`map_${territory.name}`,territory)
            this.addLayers(`map_${territory.name}`)
          }
        } else {
          for (let territory of this.territories) {
            await this.createMap(`map_${territory.name}`,territory)
            this.addLayers(`map_${territory.name}`)
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
          await this.createDeck(`deck_${this.map}`,this.territories.find(t => t.name === this.map)!,this.addHexLayer(),this.addTooltip())
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
          await this.createDeck(`deck_${territory.name}`,territory,this.addHexLayer(),this.addTooltip())
          }
        } else {
          for (let territory of this.territories) {
          await  this.createDeck(`deck_${territory.name}`,territory,this.addHexLayer(),this.addTooltip())
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
      id: 'hex-layer',
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

  public changeZoom(){
    for (let territory of this.territories) {
      if(this.$data[`deck_${territory.name}`]){
        this.$data[`deck_${territory.name}`].setProps({
          layers:[this.addHexLayer()],
          width: "100%",
          height: "100%",
        })
      }
    }
  }

  public addLayers(container) {
    this.$data[container].on('style.load', () => {
      this.$data[container].addSource('airesSource', {
        type: 'geojson',
        data: turf.featureCollection(this.aires.map(d => turf.feature(d.geom,{
          id_lieu:d.id_lieu,
          ad_lieu:d.ad_lieu,
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
      })
      this.$data[container].addLayer({
        id: 'airesLayer',
        type: 'circle',
        source: 'airesSource',
        paint: {
          'circle-radius': {
            'base': 2,
            'stops': [
            [5, 2],
            [10,5],
            ]
          },   
          'circle-color': '#000091',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': 0.4,
        },
        layout: {
          visibility: this.switchAires
        }
      })

      let popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false
      })
      this.$data[container].on('mouseenter', 'airesLayer', e => {
        let features = this.$data[container].queryRenderedFeatures(e.point)
        this.$data[container].getCanvas().style.cursor = 'pointer'
        let description = `
          <div class="fr-popup">
            <p><b>id :</b>${features[0].properties.id_lieu}</p>
            <p><b>nom :</b>${features[0].properties.ad_lieu}</p>
            <p><b>commune :</b>${features[0].properties.com_lieu}</p>
            <p><b>type :</b>${features[0].properties.type}</p>
            <p><b>date_maj :</b>${new Date(features[0].properties.date_maj).toLocaleDateString('fr-FR')}</p>
            <p><b>nbre_pl :</b>${features[0].properties.nbre_pl}</p>
            <p><b>nbre_pmr :</b>${features[0].properties.nbre_pmr}</p>
            <p><b>duree :</b>${features[0].properties.duree}</p>
            <p><b>horaires :</b>${features[0].properties.horaires}</p>
            <p><b>proprio :</b>${features[0].properties.proprio}</p>
            <p><b>lumiere :</b>${features[0].properties.lumiere}</p>
            <p><b>comm :</b>${features[0].properties.comm}</p>
          </div>`
        popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(this.$data[container])
      })
      this.$data[container].on('mouseleave', 'airesLayer', () => {
        this.$data[container].getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }
  public changeAires(){
    for (let territory of this.territories) {
      if(this.$data[`map_${territory.name}`]){
        this.$data[`map_${territory.name}`].setLayoutProperty('airesLayer', 'visibility', this.switchAires)
      }
    }
  }

  public selectedMap(event:object){
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