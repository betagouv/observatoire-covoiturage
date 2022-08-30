<template>
  <section>
    <Occupation v-if="dashboard.activeMap==='occupation'" />
    <Flux v-if="dashboard.activeMap==='flux'" :key="Key"/>
    <Aires v-if="dashboard.activeMap==='aires'" />
    <Densite v-if="dashboard.activeMap==='densite'" :key="Key" />
    <Voies v-if="dashboard.activeMap==='voies'" />
  </section>
</template>
 
<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import Flux from './Flux.vue'
import Densite from './Densite.vue'
import Occupation from './Occupation.vue'
import Aires from './Aires.vue'
import Voies from './VoiesReservees.vue'
import { mapState } from 'vuex'


@Component({
  components:{
    Flux,
    Densite,
    Occupation,
    Aires,
    Voies,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class MapIndex extends mixins(BreakpointsMixin){
  Key=0

  @Watch('screen.window', { deep: true })
  onWindowChanged() {
   this.Key += 1
  }
}
</script>

<style lang="scss">
@import '../../../assets/scss/map.scss';
</style>
