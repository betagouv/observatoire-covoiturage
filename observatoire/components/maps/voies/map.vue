<template>
  <div class="fr-grid-row content">
    <div v-if="lgAndAbove || screen.isSidebarOpen" class="fr-col-12 fr-col-lg-2 sidebar">
      <Sidebar 
        v-if="data"
        :features=data.features
        @update=update
      />
    </div>
    <div class="fr-col-12 fr-col-lg-10 map">
      <b-loading v-model="loading"></b-loading>
      <div class="fr-grid-row maps_container">
        <div v-if="['all','metropole'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-9 map_metropole">
          <div class="map_container">
            <div id="map_metropole"></div>
          </div>
        </div>
        <div v-if="['all','droms'].includes(map)" :class="{'fr-hidden': screen.isSidebarOpen}" class="fr-col-12 fr-col-lg-3 maps_drom">
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
import maplibregl from 'maplibre-gl'
import bbox from '@turf/bbox'
import Sidebar from './sidebar.vue'
import Controls from '../helpers/controls.vue'
import json from '../../../static/data/vr_covoiturage.json'

@Component({
  components:{Sidebar, Controls}
})
export default class VoiesMap extends mixins(BreakpointsMixin,MapsMixin){
  @Prop({ required: true }) map!: string

  map_metropole:any=null
  map_antilles:any=null
  map_guyane:any=null
  map_mayotte:any=null
  map_reunion:any=null
  data=json
  feature={
    geometry:{}
  }
  loading=true
  $buefy:any

  @Watch('feature',{ deep: true })
  onFeatureChanged() {
    this.fitBound()
  }

  public async mounted() {
    await this.renderMaps()
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
        this.loading=false
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
        data: this.data
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
            <p>${features[0].properties.name}</p>
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

  public update(value){
    this.feature = value
  }

  public fitBound() {
    this.map_metropole.fitBounds(bbox(this.feature.geometry), {
      padding: 20
    })  
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