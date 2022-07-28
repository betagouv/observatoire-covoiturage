<template>
  <div v-if="edit">
    <o-autocomplete
      v-model="searchfield"
      placeholder="Saisir un code INSEE ou nom du territoire"
      :data="filteredTerritories"
      field="l_territory"
      @select="option => selectedTerritory = option"
      clearable
      open-on-focus
      expanded
      maxHeight="250"
      menuClass="results"
      override
    >
      <template slot-scope="props">
        {{ props.option.l_territory }} - {{ props.option.territory }} ({{ props.option.type }})
      </template>
    </o-autocomplete>
  </div>
  <div v-else>
    <h3>
      Territoire : {{dashboard.territory.l_territory}} 
      <button @click="edition" class="fr-btn fr-icon-ball-pen-fill" title="Label bouton">
        Label bouton
      </button>
      <button v-if="selectedTerritory && selectedTerritory.territory !== 'XXXXX'" @click="resetFr" class="fr-btn fr-icon-close-circle-fill" title="Label bouton">
        Label bouton
      </button>
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
  }
}
</script>
<style lang="scss">
.results {
  width:100% !important;
  overflow-y: auto;
  background-color: #FFFFFF;
  div {
    font-size: 0.8rem;
    padding: 0 5px;
  }
  div:hover{
    background-color: #E7E7E7;
  }
}

</style>
