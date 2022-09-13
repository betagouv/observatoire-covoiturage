<template>
  <div class="fr-container--fluid">
    <client-only>
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-lg-3 sidebar">
          <Sidebar v-if="dashboard.period" />
        </div>
        <div class="fr-col">
          <o-tabs 
            v-model="activeTab"
            type="toggle" 
            position="centered"
            size="normal"
            expanded>
            <o-tab-item label="Chiffres clés" icon="car-key">
              <KeyFiguresIndex v-if="activeTab===1" />
            </o-tab-item> 
            <o-tab-item label="Cartes" icon="map">
              <MapIndex v-if="activeTab===2" /> 
            </o-tab-item>
            <o-tab-item label="Graphiques" icon="chart-bar">
              <GraphIndex v-if="activeTab===3" /> 
            </o-tab-item>
          </o-tabs>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BreakpointsMixin from '../../components/mixins/breakpoints'
import Sidebar from '../../components/dashboard/sidebar/Index.vue'
import KeyFiguresIndex from '../../components/dashboard/key_figures/Index.vue'
import MapIndex from '../../components/dashboard/maps/Index.vue'
import GraphIndex from '../../components/dashboard/graphs/Index.vue'
import { mapState } from 'vuex'
import { DashboardState } from '../../store/dashboard'

@Component({
  components:{
    //Controls,
    Sidebar,
    KeyFiguresIndex,
    MapIndex,
    GraphIndex,
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class Dashboard extends mixins(BreakpointsMixin){
  dashboard!: DashboardState 

  get activeTab() {
    return this.dashboard.activeTab
  }
  set activeTab(value) {
    this.$store.commit('dashboard/ACTIVETAB', value)
  }

  public async created(){
    await this.$store.dispatch('dashboard/getPeriod')
    await this.checkParams()
  }

  public async checkParams(){
    if(this.$route.params.type && this.$route.params.code){
      const response = await this.$axios.get(`/territory?year=${this.dashboard.period.year}&type=${this.$route.params.type}&code=${this.$route.params.code}`)
      this.$store.commit('dashboard/TERRITORY',response.data[0])
    }
    if(this.$route.params.map){
      this.$store.commit('dashboard/ACTIVEMAP',this.$route.params.map)
      this.$store.commit('dashboard/ACTIVETAB',2)
    }
  }

}
</script>