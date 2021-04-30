<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-lg-2">
          <Sidebar/>
        </div>
        <div class="fr-col-12 fr-col-lg-10">
          <Map/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from '../layouts/content/Map'
import Sidebar from '../layouts/sidebar/Sidebar'
export default {
  name: 'Home',
  components: {
    Sidebar,
    Map
  }
}
</script>

