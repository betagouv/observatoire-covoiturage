<template>
  <div v-if="!lgAndAbove" class="fr-col-12" :class="{'fr-hidden': screen.isSidebarOpen || screen.isMenuOpen}">
    <o-field grouped>
      <o-field>
        <button class="fr-btn--sm fr-btn--secondary" @click="openSidebar">
          Menu
        </button>
      </o-field>
      <o-field v-if="activeTab === 2">
      <SidebarSelectMap />
        <o-switch  class="legend" size="is-small" v-model="legend">
            Légende
        </o-switch>
      </o-field>
    </o-field>
  </div>
</template>

<script lang="ts">
import { Component,mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'
import SidebarSelectMap from '../sidebar/SelectMap.vue'

@Component({
  components:{
    SidebarSelectMap,
  },
})
export default class Controls extends mixins(BreakpointsMixin){

  get activeTab() {
    return this.$store.state.dashboard.activeTab
  }
  get legend(){
    return this.$store.state.screen.isLegendOpen
  } 
  set legend(value){
    this.openLegend()
  }
}
</script>