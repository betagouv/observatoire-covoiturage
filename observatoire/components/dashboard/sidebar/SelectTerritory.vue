<template>
  <div>
    <div class="fr-sidemenu__title">Changer de territoire :</div>
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
      rootClass="fr-input"
      menuClass="results"
      override
    >
      <template slot-scope="props">
        {{ props.option.l_territory }} - {{ props.option.territory }} ({{ props.option.type }})
      </template>
    </o-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Watch,  Vue } from 'nuxt-property-decorator'
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
  dashboard!: DashboardState
  territories:Array<TerritoryInterface>=[]
  selectedTerritory:TerritoryInterface | null = null
  searchfield =''

  get filteredTerritories() {
    return this.territories.filter((option) => {
      return (option.l_territory.toLowerCase().indexOf(this.searchfield.toLowerCase()) >= 0 
      || option.territory.indexOf(this.searchfield.toLowerCase()) >= 0)
    }).slice(0, 20)
  }

  @Watch('selectedTerritory')
  onTerritoryChanged() {
    if(this.selectedTerritory){
      this.$store.commit('dashboard/TERRITORY', this.selectedTerritory)
    }
  }

  public async mounted() {
    await this.getTerritories()
  }

  public async getTerritories(){
    const response = await this.$axios.get('/territories?year='+this.dashboard.period.year)
    this.territories = response.data
  }
}
</script>
<style lang="scss">
.results {
  width:100% !important;
  overflow-y: auto;
  div {
    font-size: 0.8rem;
    padding: 0 5px;
  }
  div:hover{
    background-color: #E7E7E7;
  }
}

</style>
