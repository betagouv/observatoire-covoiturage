<template>
  <div class="map_container">
    <o-loading :active.sync="isLoading">
      <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
    </o-loading>
    <div id="map"></div>
    <Legend :title="legendTitle" :analyzes="categories" :def="def_url" type="category" :amount="amount"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import * as turf from '@turf/helpers'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { AiresData } from '../../interfaces/maps'

@Component
export default class Aires extends mixins(MapMixin){
  data:Array<AiresData> = []
  categories = [
    {color:[102, 194, 165],val:'Supermarché',width:10},
    {color:[252, 141, 98],val:'Parking',width:10},
    {color:[141, 160, 203],val:'Aire de covoiturage',width:10},
    {color:[231, 138, 195],val:'Délaissé routier',width:10},
    {color:[166, 216, 84],val:'Auto-stop',width:10},
    {color:[255, 217, 47],val:'Parking relais',width:10},
    {color:[229, 196, 148],val:'Sortie d\'autoroute',width:10},
    {color:[179, 179, 179],val:'Autres',width:10}
  ]
  legendTitle="Aires de covoiturage (source: transport.data.gouv.fr)"
  def_url="/pages/glossaire/#aire"

  get filteredAires(){
    if(this.data){
      return turf.featureCollection(this.data.filter(a => this.dashboard.airesSwitch.filter(c => c.active === true).map(c=>c.name).includes(a.type)).map(d => turf.feature(d.geom,{
        nom_lieu:d.nom_lieu,
        com_lieu:d.com_lieu,
        type:d.type,
        date_maj: d.date_maj,
        nbre_pl:d.nbre_pl,
        nbre_pmr:d.nbre_pmr,
        horaires:d.horaires,
      })))
    }else{
      return undefined
    }
  }

  get amount(){
    let count = '0'
    if(this.filteredAires){
      count = this.filteredAires.features.length.toLocaleString('fr-FR')
    }
    return `${count} aires de covoiturages`
  }

  @Watch('dashboard.territory', { deep: true })
  async onTerritoryChanged() {
    await this.getData()
    this.map.getSource('airesSource').setData(this.filteredAires)
    const bounds = this.dashboard.territory.territory == 'XXXXX' ? [-5.225,41.333,9.55,51.2] : bbox(this.filteredAires)
    this.map.fitBounds(bounds, {padding: 50})
  }

  @Watch('dashboard.airesSwitch', { deep: true })
  async onSwitchChanged() {
    await this.getData()
    this.map.getSource('airesSource').setData(this.filteredAires)
    const bounds = bbox(this.filteredAires)
    this.map.fitBounds(bounds, {padding: 50})
  }

  public async mounted() {
    await this.getData()
    await this.createMap('map')
    this.addLayers()
    this.$store.commit('dashboard/REF_GLOSSARY', this.def_url)
  }

  public async getData(){
    try{
      this.isLoading = true
      const response = await this.$axios.get(`/aires_covoiturage?code=${this.dashboard.territory.territory}&t=${this.dashboard.territory.type}`)
      if(response.status === 204){
        this.$oruga.notification.open({
          message: response.data.message,
        })
      }
      if(response.status === 200){
        this.data = response.data
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
      if(this.dashboard.territory.territory !== 'XXXXX'){
        const bounds = bbox(this.filteredAires)
        this.map.fitBounds(bounds, {padding: 20})
      }

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
            <p><b>nom : </b>${features[0].properties.nom_lieu}</p>
            <p><b>commune : </b>${features[0].properties.com_lieu}</p>
            <p><b>type : </b>${features[0].properties.type}</p>
            <p><b>Places : </b>${features[0].properties.nbre_pl}</p>
            <p><b>Places pmr : </b>${features[0].properties.nbre_pmr}</p>
            <p><b>horaires : </b>${features[0].properties.horaires}</p>
            <p><b>Mise à jour : </b>${new Date(features[0].properties.date_maj).toLocaleDateString('fr-FR')}</p>
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

