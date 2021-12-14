<template>
  <div>
    <Header />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Component,mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../components/mixins/breakpoints'
import Header from '../components/Header.vue'

@Component({
  components: { Header }
})
export default class CarteLayout extends mixins(BreakpointsMixin){
  
  public created() {
    this.handleResize()
  }

  public beforeMount() {
    window.addEventListener('resize', this.handleResize)
  }
  
  public beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
  @import "~/assets/scss/cartes.scss";
</style>