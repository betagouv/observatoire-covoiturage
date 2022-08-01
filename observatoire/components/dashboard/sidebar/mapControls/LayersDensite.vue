<template>
  <div>
    <label class="fr-sidemenu__title">
      Couche supplémentaire :
    </label>
    <o-switch size="is-small" v-model="aires">
      Aires de covoiturage
    </o-switch>
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
export default class LayersDensite extends Vue{
  dashboard!: DashboardState

  get aires(){
    return this.dashboard.densiteAires
  }

  set aires(value){
    this.$store.commit('dashboard/DENSITE_Aires',value)
  } 
}
</script>