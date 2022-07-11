<template>
  <ul class="fr-sidemenu__list">
    <div class="fr-sidemenu__title">Choisir une carte :</div>
    <li class="fr-sidemenu__item">
      <select v-model="selectedMap" class="fr-select" id="select-map" name="select-map">
        <option v-for="option in helpers.mapList" :value="option.id" :key="option.id">{{option.name}}</option>
      </select>
    </li>
  </ul>
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