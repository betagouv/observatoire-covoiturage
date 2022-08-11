<template>
  <div class="map_container">
    <o-loading :active.sync="isLoading">
      <o-icon pack="mdi" icon="tire" size="large" variant="info" spin> </o-icon>
    </o-loading>
    <div id="map"></div>
    <Legend :title="legendTitle" :analyzes="analyse" :def=def_url type="categories"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import maplibregl from 'maplibre-gl'
import bbox from '@turf/bbox'
import json from '../../../static/data/vr_covoiturage.json'

@Component
export default class Voies extends mixins(MapMixin){
  data = json
  legendTitle="Voies de covoiturage en site propre (source: CEREMA)"
  def_url="/pages/glossaire/#voie"
  analyse=[
    {color:[229, 229, 224],val:'voie réservée',width:10,active:true}
  ]

  @Watch('dashboard.selectedVoie')
  onFeatureChanged() {
    this.fitBound()
  }

  public async mounted() {
    await this.createMap('map')
    await this.addLayers()
  }

  public addLayers() {
    this.map.on('style.load', () => {
      this.map.addSource('voiesSource', {
        type: 'geojson',
        data: this.data
      })
      this.map.addLayer({
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
      this.map.on('mouseenter', 'voiesLayer', e => {
        let features = this.map.queryRenderedFeatures(e.point)
        this.map.getCanvas().style.cursor = 'pointer'
        let description = `
          <div class="fr-popup">
            <p>${features[0].properties.name}</p>
          </div>`
        popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(this.map)
      })
      this.map.on('mouseleave', 'voiesLayer', () => {
        this.map.getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  }

  public fitBound() {
    const feature = this.data.features.find(d => d.properties.name === this.dashboard.selectedVoie)
    if(feature){
      this.map.fitBounds(bbox(feature.geometry), {
        padding: 20
      })
    }  
  }
}
</script>