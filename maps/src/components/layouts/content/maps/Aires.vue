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
        <div v-if="!lgAndAbove" class="controls" :class="{'fr-hidden': screen.isSidebarOpen}">
          <b-button type="is-primary" size="is-small" @click="selectedMap">
            <p v-if="map ==='droms'">Voir la France métropolitaine</p>
            <p v-else>Voir la France d'Outre-mer</p>
          </b-button>
          <b-switch  class="legend" size="is-small" v-model="screen.isLegendOpen">
              Légende
          </b-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Maps from '@/components/mixins/maps'
import Breakpoints from '@/components/mixins/breakpoints'
//import Sidebar from '@/components/layouts/sidebar/Sidebar'
//import Legend from '@/components/layouts/content/Legend'
import axios from 'axios'
import maplibregl from 'maplibre-gl'
import * as turf from '@turf/helpers'
//import geojsonvt from 'geojson-vt'


export default {
  name: "Map",
  mixins:[Maps,Breakpoints],
  components: {
    //Sidebar,
    //Legend
  },
  props:{
    map: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      map_metropole:null,
      map_antilles:null,
      map_guyane:null,
      map_mayotte:null,
      map_reunion:null,
      aires:null,
      filteredAires: this.aires,
      time:null,
      slider:[],
      loading: true,
      legendTitle:"Aires de covoiturage"
    }
  },
  computed:{
    test(){
      return turf.featureCollection(this.aires.map(d => turf.feature(d.geom,{id_lieu:d.id_lieu})))
    },
    countAires(){
      if(this.filteredAires){
        return this.filteredAires.length.toLocaleString('fr-FR')
      } else{
        return 0
      }
    }
  },
  async created() {
    await this.getData()
    await this.renderMaps()
  },
  methods:{
    async getData(){
      this.loading = true
      const response = await axios.get('http://localhost:8080/v1/aires_covoiturage')
      this.aires = response.data
      this.loading = false
    },
    async renderMaps() {
      if (this.map === 'metropole'){ 
        await this.createMap('map_'+this.map,this.territories.find(t => t.name === this.map))
        this.addLayers('map_'+this.map)
        this['map_'+this.map].addControl(new maplibregl.NavigationControl(), 'top-left')
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
    },
    addLayers(container) {
      this[container].on('style.load', () => {
        this[container].addSource('airesSource', {
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
        this[container].addLayer({
          id: 'airesLayer',
          type: 'circle',
          source: 'airesSource',
          paint: {
            'circle-radius': 5,     
            'circle-color': [
            'match',
            ['get', 'type'],
            'Supermarché','#66c2a5',
            'Parking','#fc8d62',
            'Aire de covoiturage','#8da0cb',
            'Délaissé routier','#e78ac3',
            'Auto-stop','#a6d854',
            'Parking relais','#ffd92f',
            'Sortie d\'autoroute','#e5c494',
            /* other */ '#b3b3b3'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
          }
        })

        let popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        })
        this[container].on('mouseenter', 'airesLayer', e => {
          let features = this[container].queryRenderedFeatures(e.point)
          this[container].getCanvas().style.cursor = 'pointer'
          let description = `
            <div class="popup">
              <p><b>id :</b>${features[0].properties.id_lieu}</p>
              <p><b>nom :</b>${features[0].properties.ad_lieu}</p>
              <p><b>commune :</b>${features[0].properties.com_lieu}</p>
              <p><b>type :</b>${features[0].properties.type}</p>
              <p><b>date_maj :</b>${features[0].properties.date_maj}</p>
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
          .addTo(this[container])
        })
        this[container].on('mouseleave', 'airesLayer', () => {
          this[container].getCanvas().style.cursor = ''
          popup.remove()
        })
      })
     
    },
    selectedMap(){
      if (this.map === 'metropole'){
        this.$emit('rerenderMap', 'droms')
      } else {
        this.$emit('rerenderMap', 'metropole')
      }
    }
  }
};
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