<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/layouts/header/Header'
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'App',
  mixins:[Breakpoints],
  components: {
    Header
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
  @import "~maplibre-gl/dist/maplibre-gl.css";
  @import "~@gouvfr/dsfr/dist/css/dsfr.min.css";
  @import "~@mdi/font/css/materialdesignicons.min.css";
  .dropdown, .slider, .filters, .map, .control_maps{
    // Set your colors
    $primary: #000091;
    $link: $primary;
    @import "~bulma";
    @import "~buefy/src/scss/buefy";
  }
  .notices{
    position: fixed;
    top: 50%;
    left: 40%;
    z-index: 1;
    .snackbar{
      width: 300px;
      text-align: center;
      background-color: #ffffff;
      border-radius: 10%;
      padding: 10px;
    }
  }
</style>


