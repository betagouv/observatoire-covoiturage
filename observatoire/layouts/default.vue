<template>
  <div>
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component,mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'

@Component
export default class Default extends mixins(BreakpointsMixin){
  
  public beforeMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
  public beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
