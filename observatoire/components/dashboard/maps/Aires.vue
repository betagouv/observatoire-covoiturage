<template>
  <div class="map_container">
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import MapMixin from '../../mixins/map'
import { Map } from 'maplibre-gl'

@Component
export default class Aires extends mixins(MapMixin){
  @Prop({ required: true }) data!: Array<>
  map:Map = null

  public async mounted() {
    await this.createMap('map')
  }
}
</script>
