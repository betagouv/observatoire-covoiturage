<template>
  <div class="fr-container--fluid">
    <div class="fr-section--banner hero">
      <div class="fr-container home_header">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col">
            <h1 class="align-center">Cartes interactives</h1>
          </div>
        </div>
      </div>
    </div>
    <MapList :contents="cartes"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MapList from '../../components/maps/MapList.vue'

@Component({
  components:{MapList}
})
export default class Cartes extends Vue{
  async asyncData({ $content }) {
    const cartes = await $content('cartes')
    .sortBy('date', 'asc')
    .fetch()

    return { cartes }
  }
}
</script>