<template>
  <div v-if="!lgAndAbove" class="controls" :class="{'fr-hidden': screen.isSidebarOpen || screen.isMenuOpen}">
    <b-field grouped>
      <b-field>
        <button class="fr-btn--sm fr-btn--secondary" @click="openSidebar">
          <p>Menu</p>
        </button>
      </b-field>
      <b-field>
        <button class="fr-btn--sm fr-btn--secondary" @click="selectedMap">
          <p v-if="map ==='droms'">France métropolitaine</p>
          <p v-else>France d'Outre-mer</p>
        </button>
      </b-field>
      <b-field>
        <b-switch  class="legend" size="is-small" v-model="isLegendOpen">
            Légende
        </b-switch>
      </b-field>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Prop, Watch } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class Controls extends mixins(BreakpointsMixin){
  @Prop({ required: true }) map!: string
  isLegendOpen = this.$store.state.screen.isLegendOpen

  @Watch('isLegendOpen')
  onLegendChanged() {
    this.$store.commit('screen/setLegendOpen',this.isLegendOpen)
  }
  
  public selectedMap(){
    if (this.map === 'metropole'){
      this.$emit('selectedMap', 'droms')
    } else {
      this.$emit('selectedMap', 'metropole')
    }
  }
}
</script>