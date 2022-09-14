<template>
  <div>
    <label class="fr-sidemenu__title">Choisir un graphique :</label>
    <select v-model="selectedGraph" class="fr-select" id="select-graph" name="select-graph">
      <option v-for="option in helpers.graphList" :value="option.id" :key="option.id">{{option.name}}</option>
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
export default class SelectGraph extends Vue{
  dashboard!: DashboardState

  get selectedGraph(){
    return this.dashboard.activeGraph
  }
  set selectedGraph(value){
    this.$store.commit('dashboard/ACTIVEGRAPH',value)
  }

}
</script>