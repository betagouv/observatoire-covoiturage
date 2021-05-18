<template>
  <div class="fr-section">
    <div class="fr-container--fluid">
      <Map/>
    </div>
  </div>
</template>

<script>
import Map from '../layouts/content/maps/MonthlyFlux'
export default {
  name: 'Home',
  components: {
    Map
  }
}
</script>
<style lang="scss">
  .slider, .map{
    // Set your colors
    $primary: #000091;
    @import "~bulma";
    @import "~buefy/src/scss/buefy";
  }
</style>