<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layouts/header/Header'
export default {
  name: 'App',
  components: {
    Header
  },
}
</script>

<style lang="scss">
  @import "~maplibre-gl/dist/maplibre-gl.css";
  @import "~@gouvfr/dsfr/dist/css/dsfr.min.css";
</style>


