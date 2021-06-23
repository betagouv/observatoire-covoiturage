<template>
  <div>
    <Header />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Component,mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'

@Component
export default class CarteLayout extends mixins(BreakpointsMixin){
  
  public beforeMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
  public beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
  @import "~/assets/scss/cartes.scss";
</style>