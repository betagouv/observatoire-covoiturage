<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="data"
        :switch ="categories"
        :allFeatures="countAires" 
      />
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
          </div>
          <Legend :title="legendTitle" :analyzes="categories" type="category"/>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
          <Legend v-if="map ==='droms'" :title="legendTitle" :analyzes="categories" type="category"/>
          <div class="map_container">
            <div id="map_antilles"></div>
          </div>
          <div class="map_container">
            <div id="map_guyane"></div>
          </div>
          <div class="map_container">
            <div id="map_mayotte"></div>
          </div>
          <div class="map_container">
            <div id="map_reunion"></div>
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
import * as turf from '@turf/helpers'
import maplibregl from 'maplibre-gl'
import { $axios } from '../../../utils/api'
import Sidebar from './sidebar.vue'
import Legend from '../helpers/legend.vue'
import Controls from '../helpers/controls.vue'

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

@Component({
  components:{Sidebar, Legend, Controls}
})
export default class VoiesMap extends mixins(BreakpointsMixin,MapsMixin){
  @Prop({ required: true }) map!: string

  map_metropole:any=null
  map_antilles:any=null
  map_guyane:any=null
  map_mayotte:any=null
  map_reunion:any=null
  time:{year:string,month:string}={
    year:'',
    month:''
  }
  data:Array<AiresData>=[]
  analyse:Array<{val:number,color:RegExpMatchArray | Array<number>,width:number}> = []
  loading=true
  legendTitle="Aires de covoiturage (source transport.data.gouv.fr)"
  categories=[
    {color:[102, 194, 165],val:'Supermarché',width:10,active:true},
    {color:[252, 141, 98],val:'Parking',width:10,active:true},
    {color:[141, 160, 203],val:'Aire de covoiturage',width:10,active:true},
    {color:[231, 138, 195],val:'Délaissé routier',width:10,active:true},
    {color:[166, 216, 84],val:'Auto-stop',width:10,active:true},
    {color:[255, 217, 47],val:'Parking relais',width:10,active:true},
    {color:[229, 196, 148],val:'Sortie d\'autoroute',width:10,active:true},
    {color:[179, 179, 179],val:'Autres',width:10,active:true}
  ]
  $buefy:any

  get filteredAires(){
    if(this.data){
      return turf.featureCollection(this.data.filter(a => this.categories.filter(c => c.active === true).map(c=>c.val).includes(a.type)).map(d => turf.feature(d.geom,{
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
    }else{
      return null
    }
  }

  get countAires(){
    if(this.filteredAires){
      return this.filteredAires.features.length.toLocaleString('fr-FR')
    } else{
      return 0
    }
  }

  public async created() {
    await this.getData()
    await this.renderMaps()
  }

  @Watch('filteredAires', { deep: true })
  onAiresChanged() {
    for (let territory of this.territories) {
      if(this.$data['map_'+territory.name]){
        this.$data['map_'+territory.name].getSource('airesSource').setData(this.filteredAires)
      }
    }
  }

  public getData(){
    return new Promise<void>(async (resolve, reject) => {
      try{
        this.loading = true
        const response = await $axios.get('/aires_covoiturage')
        this.data = response.data
        this.loading = false
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public renderMaps() {
    return new Promise<void>(async (resolve, reject) => {
      try{  
        if (this.map === 'metropole'){ 
          await this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map) || this.territories[0])
          this.addLayers('map_'+this.map)
          this.$data['map_'+this.map].addControl(new maplibregl.NavigationControl(), 'top-left')
        } else if(this.map === 'droms'){
          for (let territory of this.territories.filter(t => t.name !== 'metropole')) {
            await this.createMap('map_'+territory.name,territory)
            this.addLayers('map_'+territory.name)
          }
        } else {
          for (let territory of this.territories) {
            await this.createMap('map_'+territory.name,territory)
            this.addLayers('map_'+territory.name)
          }
          this.map_metropole.addControl(new maplibregl.NavigationControl(), 'top-left')
        }
        resolve()
      }
      catch(err){
        reject(err)
      }
    })
  }

  public addLayers(container) {
    this.$data[container].on('style.load', () => {
      this.$data[container].addSource('voiesSource', {
        type: 'geojson',
        data: '/data/vr_covoiturage.geojson'
      })
      this.$data[container].addLayer({
        id: 'voiesLayer',
        type: 'line',
        source: 'voiesSource',
        paint: {
          'line-width': 10,  
          'line-color': '#000091',
          'line-opacity': 0.8
        }
      })

      let popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false
      })
      this.$data[container].on('mouseenter', 'voiesLayer', e => {
        let features = this.$data[container].queryRenderedFeatures(e.point)
        this.$data[container].getCanvas().style.cursor = 'pointer'
        let description = `
          <div class="fr-popup">
            <p><b>nom :</b>${features[0].properties.name}</p>
            <p>${features[0].properties.description}</p>
          </div>`
        popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(this.$data[container])
      })
      this.$data[container].on('mouseleave', 'voiesLayer', () => {
        this.$data[container].getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }

  public selectedMap(){
    if (this.map === 'metropole'){
      this.$emit('rerenderMap', 'droms')
    } else {
      this.$emit('rerenderMap', 'metropole')
    }
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