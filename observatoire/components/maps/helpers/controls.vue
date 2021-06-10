<template>
  <div v-if="!lgAndAbove" class="controls" :class="{'fr-hidden': screen.isSidebarOpen || screen.isMenuOpen}">
    <b-field grouped>
      <b-field>
        <b-button type="is-primary" outlined size="is-small" @click="openSidebar">
          <p >Menu</p>
        </b-button>
      </b-field>
      <b-field>
        <b-button type="is-primary" outlined size="is-small" @click="selectedMap">
          <p v-if="map ==='droms'">France métropolitaine</p>
          <p v-else>France d'Outre-mer</p>
        </b-button>
      </b-field>
      <b-field>
        <b-switch  class="legend" size="is-small" v-model="screen.isLegendOpen">
            Légende
        </b-switch>
      </b-field>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component,mixins,Prop } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../mixins/breakpoints'

@Component
export default class Controls extends mixins(BreakpointsMixin){
  @Prop({ required: true }) map!: string

  selectedMap(){
    if (this.map === 'metropole'){
      this.$emit('selectedMap', 'droms')
    } else {
      this.$emit('selectedMap', 'metropole')
    }
  }
}
</script>