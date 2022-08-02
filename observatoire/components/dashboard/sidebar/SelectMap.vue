<template>
  <div class="controls">
    <label class="fr-sidemenu__title">Choisir une carte :</label>
    <select v-model="selectedMap" class="fr-select" id="select-map" name="select-map">
      <option v-for="option in helpers.mapList" :value="option.id" :key="option.id">{{option.name}}</option>
      <option v-if="dashboard.territory.territory === 'XXXXX'" value="voies">Voies réservées</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'


@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
      helpers: 'helpers',
    })
  }
})
export default class SelectMap extends Vue{
  dashboard!: DashboardState

  get selectedMap(){
    return this.dashboard.activeMap
  }
  set selectedMap(value){
    this.$store.commit('dashboard/ACTIVEMAP',value)
  }

}
</script>