<template>
  <div class="controls" v-if="edit">
    <o-field grouped>
      <o-autocomplete
        v-model="searchfield"
        placeholder="Saisir un code INSEE ou nom du territoire"
        :data="filteredTerritories"
        field="l_territory"
        @select="option => selectedTerritory = option"
        expanded
        open-on-focus
        maxHeight="250"
        menuClass="results"
      >
        <template slot-scope="props">
          {{ props.option.l_territory }} - {{ props.option.territory }} ({{ props.option.type }})
        </template>
      </o-autocomplete>
      <o-button @click="edit=!edit" class="fr-btn" title="Label bouton">
        <i class="mdi mdi-close-circle-outline mdi-24px"></i>
      </o-button>
    </o-field>
  </div>
  <div class="controls" v-else>
    <h3>
      Territoire : {{dashboard.territory.l_territory}} 
      <o-button @click="edition" class="fr-btn" title="Label bouton">
        <i class="mdi mdi-pencil mdi-24px"></i>
      </o-button>
      <o-button v-if="selectedTerritory && selectedTerritory.territory !== 'XXXXX'"  class="fr-btn" @click="resetFr" title="Label bouton">
        <i class="mdi mdi-close-circle-outline mdi-24px"></i>
      </o-button>
    </h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../store/dashboard'
import { TerritoryInterface } from '../../interfaces/sidebar'


@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class SelectTerritory extends Vue{
  edit = false
  dashboard!: DashboardState
  territories:Array<TerritoryInterface>=[]
  searchfield =''

  get filteredTerritories() {
    return this.territories.filter((option) => {
      return (option.l_territory.toLowerCase().indexOf(this.searchfield.toLowerCase()) >= 0 
      || option.territory.indexOf(this.searchfield.toLowerCase()) >= 0)
    }).slice(0,100)
  }

  get selectedTerritory(){
    return this.dashboard.territory
  }

  set selectedTerritory(value){
    this.$store.commit('dashboard/TERRITORY', value)
    this.edit = false
    this.$router.push(`/dashboard/${value.type}/${value.territory}`)
  }
  
  public async mounted() {
    await this.getTerritories()
  }

  public async getTerritories(){
    const response = await this.$axios.get('/territories?year='+this.dashboard.period.year)
    this.territories = response.data
  }

  public edition(){
    this.edit = true
  }
  public resetFr(){
    const territory = {
      l_territory:"France",
      territory:"XXXXX",
      type:"country"
    }
    this.$store.commit('dashboard/TERRITORY', territory)
    this.$router.push(`/dashboard`)
  }
}
</script>
