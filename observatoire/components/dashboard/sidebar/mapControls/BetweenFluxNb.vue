<template>
  <div class="controls">
    <label class="fr-sidemenu__title">
      Nombre de passagers par flux:
    </label>
    <Slider :value.sync="selectedFluxNb" :sliderOptions="{'min':0,'max':dashboard.maxFluxNb,'step':1}"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'
import Slider from '../../maps/helpers/slider.vue'

@Component({
  components:{Slider},
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class BetweenFluxNb extends Vue{
  dashboard!: DashboardState
  
  get selectedFluxNb(){
    return this.dashboard.selectedFluxNb
  }
  set selectedFluxNb(value){
    this.$store.commit('dashboard/SELECTED_FLUX_NB',value)
  }
 
  
}
</script>