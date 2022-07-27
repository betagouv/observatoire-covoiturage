<template>
  <div>
    <label class="fr-sidemenu__title">
      Type de territoire :
    </label>
    <select v-model="selectedOccupationType" class="fr-select">
      <option v-for="fluxType in fluxTypeList" :value="fluxType.type" :key="fluxType">
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
export default class SelectOccupationType extends Vue{
  dashboard!: DashboardState
  helpers!: helpersState
  selectedOccupationType = 'com'
 
  get type(){
    return this.dashboard.territory.type
  }

  get fluxTypeList(){
    const typeObject = this.helpers.territories.find(d=>d.type===this.type)
    if(typeObject){
      return this.helpers.territories.filter(d=> this.helpers.territories.indexOf(d) < this.helpers.territories.indexOf(typeObject))
    }
  }
  @Watch('selectedOccupationType')
  onOccupationTypeChanged() {
    if(this.selectedOccupationType){
      this.$store.commit('dashboard/SELECTED_OCCUPATION_TYPE', this.selectedOccupationType)
    }
  }
  
}
</script>