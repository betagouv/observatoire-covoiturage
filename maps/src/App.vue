<template>
  <div id="app">
    <Header/>
    <Home/>
  </div>
</template>

<script>
import Header from './components/layouts/header/Header'
import Home from './components/pages/Home'
import Breakpoints from '@/components/mixins/breakpoints'
export default {
  name: 'App',
  mixins:[Breakpoints],
  components: {
    Header,
    Home
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
</style>


