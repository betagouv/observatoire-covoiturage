<template>
  <div class="controls">
    <label class="fr-sidemenu__title">
      Zoom:
    </label>
    <o-slider v-model="zoom" :min="1" :max="8" ticks>
      <o-slider-tick :value="0">Min</o-slider-tick>
      <o-slider-tick :value="8">Max</o-slider-tick>
    </o-slider>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    }),
  }
})
export default class ZoomDensite extends Vue{
  dashboard!: DashboardState

  get zoom(){
    return this.dashboard.densiteZoom
  }

  set zoom(value){
    this.$store.commit('dashboard/DENSITE_ZOOM',value)
  } 
}
</script>