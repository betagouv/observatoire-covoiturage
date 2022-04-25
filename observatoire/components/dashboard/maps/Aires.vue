<template>
  <div class="map_container">
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { TerritoryInterface } from '../../interfaces/sidebar'

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

@Component
export default class Aires extends mixins(MapMixin){
  @Prop({ required: true }) territory!: TerritoryInterface
  map:any = null
  data:Array<AiresData> = []
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
      return undefined
    }
  }

  @Watch('territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    this.map.getSource('airesSource').setData(this.filteredAires)
    const bounds = bbox(this.filteredAires)
    this.map.fitBounds(bounds, {padding: 50})
  }

  public async mounted() {
    await this.getData()
    await this.createMap('map')
    await this.addLayers()
  }

  public async getData(){
    const response = await this.$axios.get(`/aires_covoiturage?code=${this.territory.territory}&t=${this.territory.type}`)
    this.data = response.data
  }

  public addLayers() {
    this.map.on('style.load', () => {
      this.map.addSource('airesSource', {
        type: 'geojson',
        data: this.filteredAires
      })
      this.map.addLayer({
        id: 'airesLayer',
        type: 'circle',
        source: 'airesSource',
        paint: {
          'circle-radius': {
            'base': 3,
            'stops': [
            [5, 3],
            [10,10],
            [15,15],
            [22, 50]
            ]
          },   
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
      const bounds = bbox(this.filteredAires)
      this.map.fitBounds(bounds, {padding: 20})

      let popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false
      })
      this.map.on('mouseenter', 'airesLayer', e => {
        let features = this.map.queryRenderedFeatures(e.point)
        this.map.getCanvas().style.cursor = 'pointer'
        if(features[0].properties){
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
          .addTo(this.map)
        }
      })
      this.map.on('mouseleave', 'airesLayer', () => {
        this.map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }
}
</script>
<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
.o-tabs__content{
  padding: 0 !important;
}
.map_container {
  height: 650px;
  #map{
    position:relative;
    height: 100%;
  }
}
</style>
