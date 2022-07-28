<template>
  <div>
    <label class="fr-sidemenu__title">
      Flux entre :
    </label>
    <select v-model="selectedFluxType" class="fr-select">
      <option v-for="fluxType in fluxTypeList" :value="fluxType.type" :key="fluxType.type">
        {{fluxType.name}}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'
import { helpersState } from '../../../../store/helpers'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
      helpers: 'helpers',
    })
  }
})
export default class SelectFluxType extends Vue{
  dashboard!: DashboardState
  helpers!: helpersState
  selectedFluxType = 'com'
 
  get type(){
    return this.dashboard.territory.type
  }

  get fluxTypeList(){
    const typeObject = this.helpers.territories.find(d=>d.type===this.type)
    if(typeObject){
      return this.helpers.territories.filter(d=> this.helpers.territories.indexOf(d) < this.helpers.territories.indexOf(typeObject))
    }
  }
  @Watch('selectedFluxType')
  onFluxTypeChanged() {
    if(this.selectedFluxType){
      this.$store.commit('dashboard/SELECTED_FLUX_TYPE', this.selectedFluxType)
    }
  }
  
}
</script>