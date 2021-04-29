<template>
  <div id="app" >
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layout/header/Header'
export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style lang="scss">
  @import "~@gouvfr/dsfr/dist/css/dsfr.min.css";
  @import "~maplibre-gl/dist/maplibre-gl.css";
</style>


