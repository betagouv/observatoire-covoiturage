<template>
  <div class="fr-select-group autocomplete">
    <label class="fr-label" for="select-hint">Saisir le code INSEE ou le nom du territoire</label>
    <b-autocomplete
      v-model="searchfield"
      placeholder="Code INSEE ou nom du territoire"
      :data="filteredTeritories"
      field="l_territory"
      @select="option => selectedTerritory = option"
      clearable
      open-on-focus
      expanded
    >
      <template slot-scope="props">
        {{ props.option.l_territory }} - {{ props.option.territory }}
      </template>
    </b-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch,  Vue } from 'nuxt-property-decorator'
import axios from 'axios'

interface Territory{
  territory:string,
  l_territory:string,
  type:string
}
@Component
export default class SearchTerritory extends Vue{
  @Prop({ required: true }) year!: string
  @Prop({ required: true }) type!: string
  territories:Array<Territory>=[]
  searchfield =''
  selectedTerritory:Territory | null = null
  results = null

  get filteredTeritories() {
    return this.territories.filter((option) => {
      return option.type === this.type && (option.l_territory.toLowerCase().indexOf(this.searchfield.toLowerCase()) >= 0 || option.territory.indexOf(this.searchfield.toLowerCase()) >= 0)
    }).slice(0, 100)
  }

  public async created() {
    await this.getTerritories()
  }

   @Watch('selectedTerritory', { deep: true })
  onTerritoryChanged() {
    if(this.selectedTerritory){
      this.$emit('changeTerritory', this.selectedTerritory.territory)
    }
  }

  public async getTerritories(){
    const response = await axios.get('http://localhost:8080/v1/territories?year='+this.year)
    this.territories = response.data
  }
  
}
</script>
<style lang="scss" scoped>
</style>