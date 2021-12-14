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
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

@Component({
  components: { Header, Footer }
})
export default class Default extends mixins(BreakpointsMixin){
  public beforeMount() {
    this.$nextTick(function () {
      this.handleResize()
    })
    window.addEventListener('resize', this.handleResize)
  }

  public beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
